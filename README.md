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
  tags: ["llm inference"],         // coarse theme(s); these become filter buttons
  tech: ["Python", "PyTorch"],     // concrete stack; display-only chips
  links: [
    { label: "Code", href: "https://github.com/malay95/my-new-thing" },
  ],
},
```

Nothing else to touch. The count updates itself and `featured: true` is what promotes it
to the home page.

Keep `tags` coarse. They are the filter buttons, so the vocabulary has to stay short:
`llm inference`, `agents`, `rag`, `evaluation`, `distributed systems`, `mlops`,
`platform`, `self-hosted`, `research`. Reuse one before adding another. Everything
specific (languages, frameworks, services) belongs in `tech`, which is display-only and
can be as detailed as you want.

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
