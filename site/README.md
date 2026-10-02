# Reading site maintenance

The public reading site renders the existing repository Markdown. Edit the
original study or Guidance to change its article; do not edit generated HTML.
The site is a reading layer, not a new runtime or study framework.

## Build and preview

Requires Node.js 22+ and Python 3.10+ for the offline checks:

```sh
npm ci --ignore-scripts
npm run build
npm run check:site
```

The default build uses the GitHub Pages project path `/Agent-Art-Lab`. For a
local preview at the server root:

```sh
SITE_BASE_PATH='' npm run build
npm run check:site -- --base-path ''
python3 -m http.server 8080 --bind 127.0.0.1 --directory _site
```

Open `http://127.0.0.1:8080`. Rebuild without `SITE_BASE_PATH` before verifying
the production path. Generated `_site/` and `node_modules/` are ignored and
excluded from the source packaging scan; the site checker validates the output.

## Add or revise a study

1. Add the canonical Markdown to its project collection and link it there.
2. Add its source path, title, date, project, status, evidence label and short
   summary to `studies.json` in this directory. The build rejects omitted studies
   in the existing THOUGHT and Pulse collections; add a new collection explicitly
   in the build when the Lab admits one.
3. Keep proposals labelled unrun and preserve evidence attribution and limits.
4. Build and check the generated pages. Inspect desktop and narrow layouts when
   changing templates, styles or wide content.

The lesson index extracts P-01 onward from the existing findings register.
Article bodies, links and heading anchors come from their original Markdown.
Repository operations such as the handoff stay linked on GitHub. Only the
explicit reading-page list and site assets are copied to the deployment artifact.

## Publishing

GitHub Pages uses the existing repository's GitHub Actions source. The pinned
workflow builds and checks pull requests; pushes to `main` also deploy `_site`.
No client JavaScript, remote fonts, analytics, database or third-party runtime
is required. Build dependencies are pinned in `package-lock.json` and can be
updated through an ordinary reviewed change.

To roll back a site change, revert its source commit and publish through the
same workflow. The documentation history remains in Git. Publication does not
change the repository's visibility, reuse licensing or project ownership.
