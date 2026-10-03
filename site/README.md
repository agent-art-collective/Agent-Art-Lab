# Reading site maintenance

The site slogan is “Articles, studies and working notes on Agent Art.” Its shared
value in `scripts/build-site.mjs` supplies the homepage heading, footer and default
page description. A small footer note says “agentart.work · starting with the
Lab”; the hero contains only the slogan and agent prompt. Homepage metadata
names the broader scope and the current Lab starting point. Article-specific
descriptions keep their own summaries.

The public reading site renders the existing repository Markdown. Edit the
original study or Guidance to change its article; do not edit generated HTML.
The homepage is the single blog feed. The former `/studies/` and `/lessons/`
listing URLs redirect to its articles section, with a visible fallback link and
no JavaScript requirement. The selected Quiet editorial layout uses a narrow
reading column and restrained rules. The operator selected Courier New Regular
with Dots as the fixed appearance on 2026-10-02.
The header's Agent-Art-Lab name links home; GitHub is the only separate top link.
Light and dark colors follow the system preference through CSS, including live
system changes and reading without JavaScript. Dark mode uses warm charcoal,
light text and subtle dots. Print keeps a light background and dark text
regardless of the screen theme.

## Appearance

Courier New Regular and the Dots texture are set in the shared HTML and CSS.
Source emphasis and table headings remain bold. Device fonts use CSS fallbacks;
no font service or font download is required. The internal design chooser and
its preference script are removed from published pages, so previously saved
comparison choices no longer change the reading style. The earlier style demo
preserves its original, separate previews.

The favicon uses a five-by-five crop of the site's Dots pattern on warm paper.
The dots are enlarged and use the muted text colors to stay visible at tab size.
Its SVG carries its own system light/dark colors. Both page builders use a
versioned icon URL to refresh earlier cached designs.

## Build and preview

Requires Node.js 22+ and Python 3.10+ for the offline checks:

```sh
npm ci --ignore-scripts
npm test
npm run build
npm run check:site
```

The default build uses the root path for `https://agentart.work/`. For a local
preview at the same root path:

```sh
npm run build
npm run check:site
python3 -m http.server 8080 --bind 127.0.0.1 --directory _site
```

Open `http://127.0.0.1:8080`. To check a project-path deployment explicitly,
run the build and checks with `SITE_BASE_PATH=/Agent-Art-Lab`; restore the default
root build before publishing. Generated `_site/` and `node_modules/` are ignored and
excluded from the source packaging scan; the site checker validates the output.

## Add or revise an article

Follow [Contribute an article](../CONTRIBUTING.md) for the complete procedure:
existing or new project files, catalogue fields, full checks, branch/fork setup,
and a PR to `agent-art-work/Agent-Art-Lab:main`. That guide is the source
of contribution instructions; this file covers site behavior and maintenance.

The homepage lists every catalogue entry, ordered by record date
(newest first), with title as the tie-breaker. New records appear automatically;
there is no separately curated homepage feature. Dates are the source's record
dates, not inferred publication dates or the date of a rebuild. Article pages
label this explicitly and link to the previous/next entry in feed order.
Preserve earlier dates when making a correction; record the dated addition in
the source. The site does not imply a fixed publication schedule.

There are no separate Archive or Lessons browsing sections. Guidance and other
reference documents remain available through the footer, article links and agent
index. The complete findings register remains a source document.
Article bodies, links and heading anchors come from their original Markdown.
Repository operations such as the handoff stay linked on GitHub. Only the
explicit reading-page list and site assets are copied to the deployment artifact.

## Agent document access

The build also generates `agent-index.json`, `llms.txt` and one complete JSON
document per canonical reading source under `documents/`. These come from the
same Markdown bytes used for the HTML pages; do not edit the generated files.
The index carries separate source and download lengths/hashes, content revisions,
source paths and study evidence labels. Article pages link to their complete
document, and every page advertises the index. The generated `llms.txt` provides
another discovery entry point without promising automatic agent support.

The homepage hero contains the prompt from the access guide's “A prompt to use”
section in a native `details` disclosure, closed by default. “Read with your
agent.” opens it with a pointer or keyboard, including without JavaScript.
Edit that canonical prompt to update both places. The full text remains in the
HTML source. A small optional script copies it on click; the expanded text is
selectable without JavaScript, and clipboard failure selects it for manual copying.

The site check requires the complete page inventory (including the 404 page),
exact agreement between the hero prompt and its source, and a labelled document
index link on every page. Browser checks are still needed for computed visibility,
responsive overflow, clipboard behavior and reading without JavaScript.

See [the access guide](../docs/AGENT_ACCESS.md) for the reading contract, relative
source-link resolution and failure handling. `scripts/check_agent_documents.py`
independently checks the export selection, exact bytes and metadata as part of
the site check. When deliberately adding a new reading source, update that
checker's selection alongside the build routes. Tests include representation,
malformed-input and integrity-failure cases; no Agent or product trial is run.

For a deployment check, use ordinary permitted HTTP GET and HEAD for the index
and downloads, then verify the actual response bytes against the index and local
build. GitHub Pages controls response headers; do not infer MIME types, security
headers or live compatibility from local source checks. An inconsistent cached
index/document pair is a failure to report, not verified acquisition.

## Publishing

The [visual direction demo](https://agentart.work/style-demo/)
compares Plain-text journal, Swiss index and Quiet editorial. These replace the
earlier rejected proposals. All three use the current slogan, canonical agent
prompt and the same three recent articles with their record dates and evidence
labels. Quiet editorial was selected and applied to the production blog; the
demo styles remain isolated to preserve the original comparison.
Links and copy buttons work, and all previews remain readable without JavaScript.

GitHub Pages uses the existing repository's GitHub Actions source and the custom
domain `agentart.work`, configured in Pages settings. The expected DNS after the
organization rename is four GitHub Pages A records, four AAAA records and a
`www` CNAME pointing to `agent-art-work.github.io`, all DNS-only in Cloudflare.
Migration verification is pending: confirm this target, the renamed organization's
GitHub ownership TXT record, valid certificates and HTTPS enforcement for the
apex and `www` domains, and redirects to `https://agentart.work/` that retain
article and document paths.
This Actions deployment does not use a `CNAME` file. The pinned
workflow builds and checks pull requests; pushes to `main` also deploy `_site`.
Reading requires no client JavaScript, remote fonts, analytics, database or
third-party runtime. The homepage and demo load their optional copy scripts.
Build dependencies are pinned in `package-lock.json` and can be
updated through an ordinary reviewed change.

To roll back a site change, revert its source commit and publish through the
same workflow. The documentation history remains in Git. Publication does not
change the repository's visibility, reuse licensing or project ownership.
