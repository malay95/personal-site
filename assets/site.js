/* ==========================================================================
   Rendering. Reads window.SITE from data/projects.js.
   Plain DOM, no dependencies, no build step.
   ========================================================================== */
(function () {
  "use strict";

  var SITE = window.SITE || { nav: [], contact: [], projects: [] };

  /* ---- helpers --------------------------------------------------------- */

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === "text") node.textContent = attrs[k];
      else if (k === "class") node.className = attrs[k];
      else node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) node.appendChild(c); });
    return node;
  }

  // Current page filename, so the active tab can be marked.
  function currentPage() {
    var path = window.location.pathname.split("/").pop();
    return path === "" ? "index.html" : path;
  }

  /* ---- left-rail tabs -------------------------------------------------- */

  function renderNav() {
    var mount = document.querySelector("[data-nav]");
    if (!mount) return;
    var here = currentPage();
    mount.textContent = "";
    SITE.nav.forEach(function (item) {
      var a = el("a", { href: item.href, text: item.label });
      if (item.sub) a.className = "nav-sub";
      // Match on filename only, so "index.html#experience" does not steal
      // the active state from "index.html".
      if (item.href.split("#")[0] === here && !item.sub) a.setAttribute("aria-current", "page");
      mount.appendChild(a);
    });
  }

  /* ---- contact links --------------------------------------------------- */

  function renderContact() {
    var mount = document.querySelector("[data-contact]");
    if (!mount) return;
    mount.textContent = "";
    (SITE.contact || []).forEach(function (c) {
      var a = el("a", { href: c.href, rel: "me noopener" }, [el("span", { text: c.label })]);
      a.appendChild(document.createTextNode(c.text));
      mount.appendChild(a);
    });
  }

  /* ---- one project card ------------------------------------------------ */

  var STATUS_TEXT = {
    active: "building",
    shipped: "shipped",
    research: "research",
    archived: "archived",
  };

  function card(p) {
    var top = el("div", { class: "card-top" }, [
      el("h3", { text: p.title }),
      el("span", { class: "chip", "data-status": p.status, text: STATUS_TEXT[p.status] || p.status }),
      el("span", { class: "where", text: [p.org, p.period].filter(Boolean).join(" · ") }),
    ]);

    var parts = [top, el("p", { text: p.summary })];

    if (p.points && p.points.length) {
      var ul = el("ul", { class: "points" });
      p.points.forEach(function (pt) { ul.appendChild(el("li", { text: pt })); });
      parts.push(ul);
    }

    if (p.result) parts.push(el("p", { class: "result", text: p.result }));

    if (p.tags && p.tags.length) {
      var tags = el("div", { class: "tags" });
      p.tags.forEach(function (t) { tags.appendChild(el("i", { text: t })); });
      parts.push(tags);
    }

    if (p.links && p.links.length) {
      var links = el("div", { class: "card-links" });
      p.links.forEach(function (l) {
        links.appendChild(el("a", { href: l.href, rel: "noopener", text: l.label }));
      });
      parts.push(links);
    }

    return el("article", { class: "card", id: p.slug }, parts);
  }

  /* ---- home page: featured strip --------------------------------------- */

  function renderFeatured() {
    var mount = document.querySelector("[data-featured]");
    if (!mount) return;
    mount.textContent = "";
    SITE.projects.filter(function (p) { return p.featured; })
      .forEach(function (p) { mount.appendChild(card(p)); });
  }

  /* ---- projects page: filterable list ---------------------------------- */

  function renderProjects() {
    var mount = document.querySelector("[data-projects]");
    if (!mount) return;

    var filterBar = document.querySelector("[data-filters]");
    var countEl = document.querySelector("[data-count]");
    var active = "all";

    // Filter buttons are derived from the tags actually in use, so a new tag
    // in data/projects.js becomes a new filter with no code change.
    var tags = [];
    SITE.projects.forEach(function (p) {
      (p.tags || []).forEach(function (t) { if (tags.indexOf(t) === -1) tags.push(t); });
    });
    tags.sort();

    function draw() {
      var shown = SITE.projects.filter(function (p) {
        return active === "all" || (p.tags || []).indexOf(active) !== -1;
      });

      mount.textContent = "";
      if (!shown.length) {
        mount.appendChild(el("p", { class: "empty", text: "Nothing tagged " + active + " yet." }));
      } else {
        shown.forEach(function (p) { mount.appendChild(card(p)); });
      }

      if (countEl) {
        countEl.textContent = shown.length + (shown.length === 1 ? " project" : " projects");
      }
      if (filterBar) {
        Array.prototype.forEach.call(filterBar.querySelectorAll("button"), function (b) {
          b.setAttribute("aria-pressed", String(b.dataset.tag === active));
        });
      }
    }

    if (filterBar) {
      filterBar.textContent = "";
      filterBar.appendChild(el("span", { class: "filter-label", text: "Filter" }));
      ["all"].concat(tags).forEach(function (t) {
        var b = el("button", { type: "button", "data-tag": t, text: t, "aria-pressed": "false" });
        b.addEventListener("click", function () {
          active = t;
          draw();
          // Keep the filter in the URL so a filtered view can be linked to.
          var url = t === "all" ? window.location.pathname : window.location.pathname + "?tag=" + encodeURIComponent(t);
          history.replaceState(null, "", url);
        });
        filterBar.appendChild(b);
      });
    }

    // Honour ?tag=... on load.
    var wanted = new URLSearchParams(window.location.search).get("tag");
    if (wanted && tags.indexOf(wanted) !== -1) active = wanted;

    draw();

    // A #slug in the URL should scroll to that card once it exists.
    if (window.location.hash) {
      var target = document.getElementById(window.location.hash.slice(1));
      if (target) target.scrollIntoView();
    }
  }

  /* ---- go -------------------------------------------------------------- */

  function init() {
    renderNav();
    renderContact();
    renderFeatured();
    renderProjects();
    var year = document.querySelector("[data-year]");
    if (year) year.textContent = String(new Date().getFullYear());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
