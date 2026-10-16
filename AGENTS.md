# AGENTS.md — read this first

Instructions for anyone, human or AI, changing this repository. It is the source
of truth. If something here conflicts with what you were told elsewhere, this
file wins for this repository, and you should say so rather than quietly ignore
it.

## What this repository is

The official website of **plain.view**, an independent developer. Published at
<https://biplab-bn.github.io/plain-view-site/> through GitHub Pages.

It does two jobs:

1. It lists every app plain.view publishes, on Google Play, Uptodown or the web.
2. It is the **shared privacy-policy host** for all of those apps. The URL given
   to every app store is `privacy.html` on this site.

Adding an app later must mean editing one data file (`assets/apps.js`), plus one
new app page and one new row in the policy table. It must never mean
restructuring the site.

## The non-negotiable rules

1. **No source code, and nothing proprietary, in this repository.** No app
   source, no Gradle files, no APKs or AABs, no keystores, no signing
   properties, no credentials, no `.env` files, no build output. Static HTML,
   CSS, JavaScript, images and text only. If you are unsure whether a file
   belongs here, it does not.
2. **No frameworks, no npm, no build step.** No CDN links, no web fonts, no
   analytics, no cookies, no trackers. Every byte the browser loads comes from
   this repository. That is what makes the site fast and what makes the privacy
   policy true.
3. **No cookie banner, ever.** Nothing is collected, so a banner would be a lie.
4. **Never invent or guess a fact.** App descriptions, permission lists and data
   collection claims come only from the app's own documentation, its manifest,
   or an explicit answer from the developer. A value you do not know is `null`
   in `assets/apps.js`, and it renders as "To be confirmed" or "Not yet
   published". Never write "varies". **A wrong privacy claim is far worse than a
   missing one**, and a store reviewer will check it against the app's data
   safety form.
5. **Never soften a permission claim.** If an app uses Device Administrator, an
   Accessibility service, or shows advertising, say exactly that, in the same
   words, everywhere the app is described.
6. **Mobile first.** Reviewers and users open these pages on phones.
7. **Light and dark mode** through `prefers-color-scheme`. No theme-switching
   JavaScript.
8. **Plain, honest English.** No marketing hype, no superlatives, no claims you
   cannot point at.
9. **Never link to a private repository.** A dead link is a common store
   rejection reason. The only repository this site may reference is
   `biplab-bn/plain-view-site`, which is public.

## The file map

```
.nojekyll                     empty; stops GitHub Pages ignoring _ files
index.html                    home page and app grid
privacy.html                  the shared policy, read by store reviewers
apps/<slug>.html              one detail page per app
assets/apps.js                THE data file: every app is listed here
assets/style.css              the only stylesheet
assets/icon-512.png           site icon, also the favicon
assets/banner.png             1024x500 featured image for store listings
assets/apps/<slug>/*.png      app icon and screenshots
assets/screenshots/*.png      copies for reuse in store listings
robots.txt
README.md
AGENTS.md                     this file
```

## Where the facts live, and how they stay true

`assets/apps.js` holds each app's name, tagline, status, links, permissions and
data collection. It is the single source of truth.

`privacy.html` and `apps/<slug>.html` are plain HTML, deliberately, so they read
correctly with JavaScript switched off. They therefore repeat those values.

To stop the copies drifting apart, every fact list in the HTML carries
`data-facts="<slug>"`, and each value carries `data-fact="permissions"`,
`"collects"` or `"platform"`. `assets/apps.js` compares the two and **prints any
disagreement to the browser console**: each app page checks its own table, and
`index.html` and the app pages also read `privacy.html` and check the policy
table against the data file. So after changing any fact, open `index.html` with
devtools open. A quiet console means every copy agrees.

`privacy.html` deliberately carries no `<script>` tag, because a store reviewer
may read it with JavaScript switched off. That is why the check for it runs from
the other pages rather than from the policy page itself.

## Adding a new app

Follow these in order.

1. **Add an entry to `assets/apps.js`.** Copy an existing entry and change every
   value. Do not leave an old slug, page path or tagline behind. Set `icon` to
   `null` if there is no icon yet, and `store` and `web` to `null` until a real,
   working URL exists.

   ```js
   {
     slug: "my-app",                    // lowercase, hyphens, matches the page name
     name: "My App",
     kind: "android",                   // "android" | "web"
     tagline: "One line, plain English, under 90 characters.",
     icon: null,
     status: "coming-soon",             // "published" | "coming-soon"
     store: null,
     web: null,
     page: "apps/my-app.html",
     permissions: "To be confirmed",    // exact, or null if genuinely unknown
     collects: "To be confirmed",       // exact, or null if genuinely unknown
     since: null,
     screenshots: []
   }
   ```

2. **Create the folder `assets/apps/<slug>/`** and put the screenshots in it,
   numbered in the order you want them shown: `01-something.png`,
   `02-something-else.png`, and so on.

3. **Create `apps/<slug>.html`**, following `apps/notepad.html` as the template.
   Change the title, the meta description, the heading, the fact list, the
   screenshots and the "Where to get it" wording. Keep the masthead, the footer
   and the fact-list structure exactly as they are: the footer carries the
   contact email and the privacy-policy link that every page must have, and the
   fact list is what the drift check reads. Fix the relative paths (`../assets/…`).

4. **Add a row to the per-app table in `privacy.html`,** and add the app to the
   "Apps covered by this policy" list above it. Use the same wording for
   permissions and data collection as `apps.js`. This step is not optional: a
   store reviewer looks for the app by name on the policy page.

5. **Copy the app icon to `assets/apps/<slug>/icon.png`** and set `icon` in
   `apps.js` to `assets/apps/<slug>/icon.png`. Until you do, the card and the app
   page fall back to `assets/icon-512.png`, which is the site icon and not this
   app's.

6. **When the app is published,** set `status` to `"published"`, `since` to the
   year, and `store` to the real store URL. Update the "Where to get it" section
   of the app page so it links to the listing instead of saying it is not
   published yet.

7. **Run the verification checklist** at the bottom of this file.

## Adding a web app

A web app is a `kind: "web"` entry: it has a `web` URL instead of a `store` URL.

1. Add the entry with `kind: "web"` and `web: "https://…"`. Leave `store` as
   `null`. If the web app is not live yet, leave `web` as `null` and set
   `status` to `"coming-soon"`; a null `web` renders as text, never a broken link.
2. Its card is styled differently on purpose: `.card-web` in `assets/style.css`
   swaps the accent edge from blue to green so a web app is not mistaken for an
   Android app you can install.
3. Create `apps/<slug>.html` as usual. In the fact list, `platform` reads "Web"
   automatically from the data file; keep the page's own value in step with it.
4. Add it to the policy table and the "Apps covered" list the same way as any
   other app. A web app that collects nothing says "Nothing", exactly like an
   app.
5. If the web app is served from this same site, say where its files live in the
   pull request or commit message, so the next person can find them.

## Keeping a claim honest when an app changes

When an app starts or stops doing something that the policy mentions — adding
advertising, dropping an analytics SDK, requesting a new permission — the policy
must be changed **before** that version is released, and the "Last updated" date
at the top of `privacy.html` must change with it. Update `assets/apps.js`, the
app's page, and the policy table together, then run the checklist.

## Publishing

GitHub Pages serves this repository from the `main` branch, root folder. Push to
`main`, then wait one to three minutes. `.nojekyll` must exist, or Pages will
ignore files and folders whose names begin with an underscore.

```bash
git add .
git commit -m "…"
git push origin main
```

## Verification checklist

Run this before reporting any change as finished.

- [ ] `python -m http.server` in this folder, then open
      <http://localhost:8000/> and click through every page.
- [ ] Every page has `<html lang="en">`, a viewport meta tag, a unique `<title>`,
      a unique `<meta name="description">`, the favicon, a visible link to
      `privacy.html`, and the contact email as visible text.
- [ ] `privacy.html` reads correctly with JavaScript disabled, and the policy
      text is present in the page source, not assembled by script.
- [ ] Every app is named in the "Apps covered by this policy" list and has a row
      in the permissions table.
- [ ] No link on any page points at a repository that is not public, and
      `grep -ri "biplab-bn" .` only ever shows `plain-view-site`.
- [ ] Every store and web link that renders opens. Any `null` renders as text:
      "Not yet published" or "To be confirmed".
- [ ] No page references an image that does not exist.
- [ ] The console is quiet on `index.html` and on each app page. That is both
      the fact-drift check and the policy-table check passing.
- [ ] Checked at 360px wide and at desktop width, in both light and dark mode.
- [ ] `git status` shows no source code, build output, keystore or credential
      file staged.
