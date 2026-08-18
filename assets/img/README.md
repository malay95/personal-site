# Images

Drop files here and they show up. Nothing to rebuild — the paths are already
wired in `data/site.js`. If a file is absent the page silently drops that
figure, so a half-filled folder never looks broken.

| File | Used by | Shape | Aim for |
|---|---|---|---|
| `malay.jpg` | home hero portrait | 4:5 portrait, cropped to fill | 640×800, under 200 KB |
| `mini-inference-server.gif` | project card | any ratio, capped at 26rem tall | under 3 MB |

Notes:

- **Portrait** is cropped with `object-fit: cover`, so keep your head off the
  exact edges — a little margin survives the crop at every screen width.
- **GIFs** are the one thing here that can get heavy. A 10-second terminal
  recording at 12 fps and 800px wide usually lands near 1–2 MB. If it goes past
  ~4 MB, cut the frame rate before the dimensions.
- JPEG or WebP for photographs, PNG for screenshots with text in them.
- Adding a second project image: copy the `media:` block onto any entry in
  `SITE.projects` and point it at a file in this folder.
