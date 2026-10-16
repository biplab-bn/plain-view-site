/*
 * plain.view — the one data file.
 *
 * Every app this developer publishes is listed in the APPS array below.
 * index.html builds its app grid from it. The app pages and privacy.html are
 * plain HTML so they read correctly with JavaScript switched off, and this
 * file's fact values are the ones that must match them — see checkFacts()
 * at the bottom, which reports any drift in the browser console.
 *
 * See AGENTS.md for the full procedure. Rules that matter:
 *   - "permissions" and "collects" are exact quotes, never a guess.
 *     If a value is unknown, use null and it renders as "To be confirmed".
 *     Never write "varies".
 *   - "store" and "web" must be real, working URLs or null. A null never
 *     becomes a link.
 *   - "since" is the year the app was first published, or null while it is
 *     still unreleased.
 *   - "screenshots" is optional. Paths are relative to the site root.
 */

const APPS = [
  {
    slug: "notepad",
    name: "Notepad: Private Notes",
    kind: "android",                 // "android" | "web"
    tagline: "An offline notepad with Markdown, tags and no ads. No tracking.",
    icon: "assets/apps/notepad/icon.png",   // null until supplied
    status: "published",             // "published" | "coming-soon"
    store: null,                     // store URL, or null
    web: null,                       // live URL for kind "web", or null
    page: "apps/notepad.html",
    permissions: "None",
    collects: "Nothing",
    since: "2026",
    screenshots: [
      { src: "assets/apps/notepad/05-markdown-rendered.png", caption: "Markdown, HTML and tables rendered properly in reading mode. Web addresses become tappable links." },
      { src: "assets/apps/notepad/01-notes-list.png", caption: "The note list, with pinned notes held at the top." },
      { src: "assets/apps/notepad/02-editor-tags.png", caption: "The editor. Type a #hashtag in the text, or use Tag to attach one without touching the words." },
      { src: "assets/apps/notepad/03-view-mode.png", caption: "Reading mode: headings, bold, lists and tables, all rendered properly." },
      { src: "assets/apps/notepad/04-search.png", caption: "Search every note at once, plus find and replace." },
      { src: "assets/apps/notepad/06-settings.png", caption: "Font, text size, and light or dark, chosen by you." },
      { src: "assets/apps/notepad/07-help.png", caption: "Built-in help, including the keyboard shortcuts." }
    ]
  },
  {
    slug: "soft-keys",
    name: "Soft Keys - Volume & Power Controller",
    kind: "android",
    tagline: "Software volume, power and lock controls for broken buttons. No root, no network.",
    icon: null,
    status: "coming-soon",
    store: null,
    web: null,
    page: "apps/soft-keys.html",
    permissions: "Device Administrator, an Accessibility service, Foreground service, Foreground service (special use), Notifications, Boot completed, Vibrate, Modify audio settings",
    collects: "Nothing",
    since: null,
    screenshots: []
  },
  {
    slug: "ventoydroid",
    name: "VentoyDroid",
    kind: "android",
    tagline: "Turn a USB stick into a multiboot installer using your phone. No root.",
    icon: null,
    status: "coming-soon",
    store: null,
    web: null,
    page: "apps/ventoydroid.html",
    permissions: "USB host access, Internet, Network state, Foreground service, Notifications, Wake lock, and the advertising-ID permissions added by Google AdMob",
    collects: "Advertising data (Google AdMob) and technical diagnostics, the last only in an error report you choose to send",
    since: null,
    screenshots: []
  }
];

/* Fallback icon, used whenever an app has no icon of its own yet. */
const SITE_ICON = "assets/icon-512.png";

/* The policy every app on this site is covered by. */
const PRIVACY_URL = "privacy.html";

/* "" on the home page, "../" on a page inside apps/. */
const BASE_PATH = location.pathname.indexOf("/apps/") === -1 ? "" : "../";

/* ---- Nothing below this line needs editing when you add an app. ---- */

function appIcon(app) {
  return app.icon || SITE_ICON;
}

function statusLabel(app) {
  if (app.status === "published") return "Published";
  if (app.status === "coming-soon") return "Coming soon";
  return "To be confirmed";
}

function statusClass(app) {
  return app.status === "published" ? "is-live" : "is-soon";
}

function shown(value, fallback) {
  if (value === null || value === undefined || value === "") {
    return fallback || "To be confirmed";
  }
  return value;
}

function esc(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* A link is only ever built from a real URL. Null renders as text, never as a
   link that looks like it works. */
function linkOrText(url, label, whenMissing) {
  if (!url) {
    return '<span class="muted">' + esc(whenMissing) + "</span>";
  }
  return '<a href="' + esc(url) + '" rel="noopener">' + esc(label) + "</a>";
}

function storeSlot(app) {
  if (app.kind === "web") {
    return linkOrText(app.web, "Open the web app", "Web app: coming soon");
  }
  return linkOrText(app.store, "Store listing", "Store listing: coming soon");
}

function renderCard(app) {
  var card = document.createElement("article");
  card.className = "card" + (app.kind === "web" ? " card-web" : "");

  card.innerHTML =
    '<div class="card-head">' +
      '<img class="app-icon" src="' + esc(appIcon(app)) + '" alt="" width="64" height="64">' +
      "<div>" +
        '<h3 class="card-title"><a href="' + esc(app.page) + '">' + esc(app.name) + "</a></h3>" +
        '<p class="card-tagline">' + esc(app.tagline) + "</p>" +
        '<p><span class="status ' + statusClass(app) + '">' + statusLabel(app) + "</span></p>" +
      "</div>" +
    "</div>" +
    '<dl class="facts">' +
      "<dt>Platform</dt><dd>" + (app.kind === "web" ? "Web" : "Android") + "</dd>" +
      "<dt>Permissions</dt><dd>" + esc(shown(app.permissions)) + "</dd>" +
      "<dt>Data collected</dt><dd>" + esc(shown(app.collects)) + "</dd>" +
    "</dl>" +
    '<p class="card-links">' +
      '<a href="' + esc(app.page) + '">Details and screenshots</a> ' +
      storeSlot(app) +
    "</p>";

  return card;
}

function renderGrid(rootId, filter) {
  var root = document.getElementById(rootId);
  if (!root) return;
  var list = APPS.filter(function (app) { return !filter || filter(app); });
  if (!list.length) {
    root.innerHTML = '<p class="muted">Nothing here yet.</p>';
    return;
  }
  list.forEach(function (app) { root.appendChild(renderCard(app)); });
}

/* The facts this file says are the facts a page has to show. */
function expectedFacts(app) {
  return {
    platform: app.kind === "web" ? "Web" : "Android",
    permissions: shown(app.permissions),
    collects: shown(app.collects)
  };
}

function compareFacts(where, list, app) {
  var expected = expectedFacts(app);
  Object.keys(expected).forEach(function (key) {
    var node = list.querySelector('[data-fact="' + key + '"]');
    if (!node) {
      console.warn("[plain.view] " + where + ": no [data-fact=\"" + key + "\"] for " + app.slug);
      return;
    }
    if (node.textContent.trim() !== expected[key]) {
      console.warn("[plain.view] " + where + ": " + app.slug + " " + key + " disagrees with assets/apps.js\n" +
        "  on the page: " + node.textContent.trim() + "\n" +
        "  in apps.js:  " + expected[key]);
    }
  });
}

function appFor(slug) {
  return APPS.filter(function (a) { return a.slug === slug; })[0];
}

/*
 * The app pages and privacy.html are static HTML, so their wording can drift
 * away from this file. Each states data-facts="<slug>" on its fact list and
 * data-fact="permissions|collects|platform" on each value. A mismatch is a wrong
 * privacy claim waiting to happen, so it is reported loudly rather than
 * silently. This runs on the pages that load this script: index.html and each
 * app page. privacy.html itself carries no script, by design.
 */
function checkFacts() {
  document.querySelectorAll("[data-facts]").forEach(function (list) {
    var app = appFor(list.getAttribute("data-facts"));
    if (!app) {
      console.warn("[plain.view] no entry in assets/apps.js for data-facts=\"" +
        list.getAttribute("data-facts") + "\"");
      return;
    }
    compareFacts("this page", list, app);
  });
}

/*
 * privacy.html must not depend on JavaScript, so it cannot check itself. These
 * pages check it instead, by reading it and comparing its table with this file.
 * Only the table cells carrying data-facts are compared.
 */
function checkPolicy() {
  if (!/^https?:$/.test(location.protocol)) return;   // file:// has no fetch
  fetch(BASE_PATH + PRIVACY_URL, { credentials: "same-origin" })
    .then(function (res) { return res.text(); })
    .then(function (source) {
      var doc = new DOMParser().parseFromString(source, "text/html");
      var seen = 0;
      doc.querySelectorAll("[data-facts]").forEach(function (list) {
        var app = appFor(list.getAttribute("data-facts"));
        if (!app) {
          console.warn("[plain.view] privacy.html has a row for \"" +
            list.getAttribute("data-facts") + "\", which is not in assets/apps.js");
          return;
        }
        seen++;
        compareFacts("privacy.html", list, app);
      });
      APPS.forEach(function (app) {
        if (!doc.querySelector('[data-facts="' + app.slug + '"]')) {
          console.warn("[plain.view] privacy.html has no table row for \"" + app.slug +
            "\" (data-facts=\"" + app.slug + "\")");
        }
      });
      if (seen) console.log("[plain.view] privacy.html table matches assets/apps.js (" + seen + " rows)");
    })
    .catch(function (err) {
      console.warn("[plain.view] could not read " + PRIVACY_URL + " to check the policy table: " + err);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  renderGrid("app-grid", null);
  checkFacts();
  checkPolicy();
});
