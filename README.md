# Personal site, v2

Static site, no build step, no dependencies. Hosted on GitHub Pages, DNS through Cloudflare.
Same rules as v1: edit data, commit, push.

```
index.html         home: hero, metrics, latest writing, selected work, experience, stack, papers
writing.html       the post index
post.html          renders one post from markdown (post.html?p=<slug>)
projects.html      filterable project list
about.html         longer bio
now.html           what has my attention this month
404.html           not-found page
data/site.js       >>> the file you normally edit <<<  (nav, hero, now, posts index, projects)
posts/*.md         one markdown file per post
assets/site.css    all styling, tokens at the top
assets/site.js     rendering (masthead, theme toggle, lists, filters, post page, reveals)
assets/md.js       the small markdown renderer
```

## The Writing section is built but switched off

`writing.html`, `post.html`, the markdown renderer, and four post files are all in the
repo and working, but **Writing is not in the tab bar and the home page does not link
posts**. The three drafts still say "Draft. Replace this paragraph with the post.", and
`paged-kv-cache-by-hand.md` narrates a paged KV cache and a p99 result that
`mini-inference-server` has not measured yet (its BENCHMARKS.md still lists M3 as TBD).

To turn the section on once you have written something real:

1. Uncomment the `Writing` line in `SITE.nav` in `data/site.js`.
2. Uncomment `<section data-recent-posts></section>` in `index.html`, and bump the
   section numerals in `assets/site.js` back to `02`-`06`.
3. Drop the `noindex` meta tags from `writing.html` and `post.html`.

## Add a blog post

Two steps.

1. Write `posts/my-new-post.md`, starting with front matter:

```markdown
---
title: My New Post
date: Sep 2026
read: 8 min
kind: notes
standfirst: One sentence that makes someone want to read it.
tags: [llm inference, benchmarks]
---

Body starts here.
```

2. Add a block to the **top** of `SITE.posts` in `data/site.js` (newest first):

```js
{ slug: "my-new-post", title: "My New Post", date: "Sep 2026", read: "8 min", kind: "notes",
  blurb: "One sentence for the index page.", tags: ["llm inference"] },
```

The slug must match the filename. `kind` is a free-text label shown as a chip
(`notes`, `essay`, `deep dive`). Order in the array is the order on the page, and
prev/next on the post page follows it.

### What the markdown supports

`# ## ###` headings, paragraphs, `- lists`, `> quotes`, fenced code blocks with
``````, inline ``code``, `**bold**`, `*italic*`, `[links](https://example.com)`,
footnotes as `[^1]` in the text with `[^1]: the note` at the bottom, and a callout:

```markdown
:::note
The line you want in a highlighted box.
:::
```

Anything fancier than that is not supported on purpose. `assets/md.js` is ~120 lines
and easy to extend if you need one more thing.

## Add a project

Unchanged from v1: copy a block in `SITE.projects` in `data/site.js`. `featured: true`
also puts it on the home page. Keep `tags` coarse (they are the filter buttons);
put specifics in `tech`, which is display-only.

## Add a tab

Add a line to `SITE.nav`, then copy `now.html` to the new filename and replace the
`<main>` contents. The masthead, tabs, active-tab state, and footer come from data.

## Theme

Three states, cycled by the button in the tab bar and remembered in `localStorage`:
`AUTO` (follows the OS), `LIGHT`, `DARK`. Tokens for all three live at the top of
`assets/site.css` — change a hex there and it changes everywhere.

## Motion

Entrance animations use CSS only. Scroll reveals use scroll-driven animations
(`animation-timeline: view()`) where the browser supports them, and an
IntersectionObserver fallback in `site.js` where it does not. Everything is disabled
under `prefers-reduced-motion`.

## Preview locally

```powershell
python -m http.server 8000
# then open http://localhost:8000
```

Use the server, not the file directly: `post.html` `fetch()`es the markdown, and
`file://` blocks that.

## Deploy

Push to `main`. GitHub Pages rebuilds in under a minute.

```powershell
git add -A
git commit -m "Add post X"
git push
```

## Custom domain (GitHub Pages + Cloudflare DNS)

The site is served at **https://aboutme.malaysshah.com**. The `CNAME` file in this repo
holds that hostname on a single line; deleting it disconnects the domain.

Because this is a **subdomain**, DNS is a single record. The four A records GitHub
documents are only for apex domains (`malaysshah.com` with no prefix) and are not used
here.

In Cloudflare DNS for `malaysshah.com`:

| Type  | Name    | Value               | Proxy    |
|-------|---------|---------------------|----------|
| CNAME | aboutme | malay95.github.io   | DNS only |

`malay95.github.io` is correct even though the repo is `personal-site`: the CNAME target
is always your GitHub user domain, never the repository.

Keep the proxy **DNS only** (grey cloud) until GitHub finishes issuing the TLS
certificate, otherwise validation fails. Once HTTPS works you may switch the proxy on,
but only with Cloudflare SSL mode set to **Full** — Flexible causes a redirect loop
against Pages.

Then in the repo: Settings → Pages → Custom domain → `aboutme.malaysshah.com` → tick
**Enforce HTTPS** once the certificate is provisioned (can take up to an hour).

### Checking it

```powershell
nslookup aboutme.malaysshah.com          # should resolve via malay95.github.io
curl -I https://aboutme.malaysshah.com   # expect 200
```

## If you later want the apex too

To serve `malaysshah.com` itself, add these at the apex and change `CNAME` to match
(values from GitHub's custom-domain docs, verified August 2026):

| Type | Name | Value                                       |
|------|------|---------------------------------------------|
| A    | @    | 185.199.108.153 … .109 … .110 … .111        |
| AAAA | @    | 2606:50c0:8000::153 … 8001 … 8002 … 8003    |
