# plain.view

The website of plain.view, an independent developer. It is published at
<https://biplab-bn.github.io/plain-view-site/>.

It does two things:

- it lists every app plain.view publishes, with each app's permissions and data
  collection stated plainly;
- it is the **shared privacy policy** for all of those apps. Every store listing
  points at `privacy.html` on this site.

## Adding an app

Every app is listed in one file: [`assets/apps.js`](assets/apps.js). Adding an
app means adding an entry there, creating `apps/<slug>.html`, and adding a row to
the table in `privacy.html`. The full, numbered procedure is in
[AGENTS.md](AGENTS.md), which is the source of truth for changes to this
repository.

## Running it locally

There is no build step and no dependencies. Open `index.html` directly, or serve
the folder so that relative paths behave exactly as they do in production:

```bash
python -m http.server 8000
```

Then visit <http://localhost:8000/>.

## What this repository deliberately does not contain

No app source code, no build files, no keystores, no credentials. This
repository is public and is meant to stay that way; see the rules at the top of
[AGENTS.md](AGENTS.md). It also contains no framework, no npm package, no CDN
link, no web font, no analytics, no cookie and no tracker, which is why the site
loads nothing from anywhere except this repository.

## Contact

<planview.apps@gmail.com>

Problems and bug reports: <https://github.com/biplab-bn/plain-view-site/issues>

## Licence

The text and images in this repository are copyright plain.view. All rights
reserved.

The apps the site describes are licensed separately, and the site says so
plainly: Notepad: Private Notes and Soft Keys - Volume & Power Controller are
proprietary software, while VentoyDroid is free software under the
GPL-3.0-or-later.
