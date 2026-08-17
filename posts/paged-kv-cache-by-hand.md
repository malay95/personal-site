---
title: Writing a paged KV cache by hand
date: Aug 2026
read: 12 min
kind: deep dive
standfirst: What operating-system virtual memory taught me about attention caches, and the three bugs that only show up above concurrency four.
tags: [llm inference, cuda, benchmarks]
---

The first version of my inference server allocated one contiguous KV tensor per request, sized to the maximum sequence length. It worked, and it was wrong in the way that only shows up when you look at a memory graph: at eight concurrent requests, most of the GPU was reserved for tokens that did not exist yet.

Reserving for the worst case is the same mistake early operating systems made with process memory, and the fix is the same one they landed on. Stop handing out contiguous ranges. Hand out fixed-size blocks and keep a table that says which block holds which slice of the sequence. [^1]

## Blocks, and the table that finds them

A block holds sixteen tokens of keys and values for one layer. A request owns a list of block ids, in order, and nothing else. Growing a sequence means appending a block id; freeing a request means returning its ids to a pool. Fragmentation stops being a memory-layout problem and becomes a list-of-integers problem, which is a much better problem to have.

```python
class BlockTable:
    def __init__(self, n_blocks, block_size=16):
        self.free = deque(range(n_blocks))
        self.block_size = block_size
        self.tables = {}                      # req_id -> [block_id, ...]

    def append_token(self, req_id):
        table = self.tables.setdefault(req_id, [])
        used = self.n_tokens[req_id] % self.block_size
        if used == 0:                         # current block is full
            if not self.free:
                raise Preempt(req_id)         # caller decides who yields
            table.append(self.free.popleft())
        self.n_tokens[req_id] += 1
        return table[-1], used
```

The attention kernel then gathers along that table instead of reading a flat range. On a card without tensor cores the gather is not free, but it is far cheaper than the throughput I was giving away by refusing to admit a ninth request.

## The three bugs

:::note
All three were invisible at concurrency one and two, which is exactly why the benchmark harness runs the same prompts at 1, 4, 8, and 16 before I believe anything.
:::

**Block reuse without zeroing.** A freed block still holds the previous request's keys, and a sequence that reads one token past its own length gets a plausible, entirely fabricated continuation. Nothing crashes. The output just quietly comes from someone else's conversation. [^2]

**Preemption at the wrong boundary.** When the pool runs dry, something has to yield. I first evicted the longest sequence, which is the one that has done the most work and will cost the most to recompute. Evicting the newest arrival instead cut p99 by a third.

**The free list outliving its request.** A cancelled connection returned its blocks, then the still-running decode step appended one more token to a table whose blocks had already been handed to somebody else. The fix was boring - a generation counter on every table - and the bug was a full evening.

> Every milestone gets the same prompts, the same seed, and the same token budget. Otherwise a speedup is a story I am telling myself.

## Where the numbers landed

The M0 sequential baseline measured 21.4 tok/s at concurrency 1 and 31.1 tok/s at concurrency 8, with p99 latency 5.6x worse at the top end. That gap is the serialization cliff, and it is the whole reason paging and continuous batching exist. Paging alone does not close it; it makes closing it affordable, because the scheduler finally has small pieces to move around.

Next milestone is the batching scheduler itself: admission and eviction at the token level, so the GPU never idles behind the slowest sequence in the batch. I will publish the numbers whether or not they flatter me.

[^1]: The paged-attention idea comes from the vLLM paper; this is a small reimplementation for my own understanding, not a competitor to it.
[^2]: This is the strongest argument I have found for zeroing on free rather than on allocate: the failure is silent, and silent failures do not show up in a latency graph.
