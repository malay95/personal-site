# Personal site

Static site, no build step, no dependencies. Hosted on GitHub Pages, DNS through Cloudflare.

```
index.html         home page
projects.html      the project entrypoint (filterable, renders from data)
data/projects.js   >>> the only file you normally edit <<<
assets/site.css    all styling, tokens at the top
assets/site.js     rendering (nav, contact, project cards, filters)
404.html           not-found page
.nojekyll          tells Pages to serve files as-is, no Jekyll processing
CNAME              your custom domain, one line
```

## Add a project

Open `data/projects.js`, copy an existing block in `SITE.projects`, fill it in.

```js
{
  slug: "my-new-thing",           // unique, kebab-case, used for #deep-links
  title: "My New Thing",
  org: "Personal",                // or "BILL", "ASU", ...
  period: "2026, ongoing",
  status: "active",               // active | shipped | research | archived
  featured: true,                 // true also puts it on the home page
  summary: "One or two sentences: what it is and why it exists.",
  points: [                       // optional, the interesting engineering details
    "A thing that was hard and how it works.",
  ],
  result: "Measured outcome. Numbers, not adjectives.",   // optional
  tags: ["llm inference", "python"],   // lowercase; these become filter buttons
  links: [
    { label: "Code", href: "https://github.com/malay95/my-new-thing" },
  ],
},
```

Nothing else to touch. New tags become filter buttons automatically, the count updates
itself, and `featured: true` is what promotes it to the home page.

Order in the file is the order on the page. Put the thing you most want seen first.

**Leave `links: []` if the repo is private.** The card renders fine without links, and an
empty list is better than a 404 in front of a hiring manager.

## Add a tab

Two steps:

1. Add a line to `SITE.nav` in `data/projects.js`:
   ```js
   { label: "Writing", href: "writing.html" },
   ```
2. Copy `projects.html` to `writing.html` and replace the `<main>` contents.

The rail, tabs, contact links, and active-tab highlight all render from the data file,
so every page picks up the new tab with no further edits.

## Preview locally

```powershell
python -m http.server 8000
# then open http://localhost:8000
```

Use the server rather than double-clicking the file: opening `index.html` straight from
disk works here, but the server matches how Pages actually serves it.

## Deploy

Push to `main`. GitHub Pages rebuilds in under a minute.

```powershell
git add -A
git commit -m "Add project X"
git push
```

## Custom domain (GitHub Pages + Cloudflare DNS)

The `CNAME` file in this repo must contain your apex domain on a single line, e.g.
`malayshah.dev`. Then in Cloudflare DNS add:

| Type  | Name | Value                  |
|-------|------|------------------------|
| A     | @    | 185.199.108.153        |
| A     | @    | 185.199.109.153        |
| A     | @    | 185.199.110.153        |
| A     | @    | 185.199.111.153        |
| AAAA  | @    | 2606:50c0:8000::153    |
| AAAA  | @    | 2606:50c0:8001::153    |
| AAAA  | @    | 2606:50c0:8002::153    |
| AAAA  | @    | 2606:50c0:8003::153    |
| CNAME | www  | malay95.github.io      |

(Values confirmed against GitHub's custom-domain docs, August 2026.)

Set the proxy status to **DNS only** (grey cloud) until GitHub finishes issuing the TLS
certificate, otherwise the validation fails. Then in the repo: Settings → Pages → enter
the domain → tick **Enforce HTTPS**.

Verify the current IPs against GitHub's docs before trusting the table above; they change
rarely but they do change.

## Before going live

- Replace `REPLACE-WITH-YOUR-DOMAIN` in `index.html` and `projects.html`
  (`canonical` and `og:url`, two occurrences per file).
