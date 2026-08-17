/* ==========================================================================
   Rendering. Reads window.SITE from data/site.js. Plain DOM, no dependencies.
   Pages declare mount points with data-* attributes; this file fills them.
   ========================================================================== */
(function () {
  "use strict";

  var SITE = window.SITE || { nav: [], contact: [], projects: [], posts: [] };

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === "text") node.textContent = attrs[k];
      else if (k === "html") node.innerHTML = attrs[k];
      else if (k === "class") node.className = attrs[k];
      else node.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) node.appendChild(c); });
    return node;
  }
  function q(sel) { return document.querySelector(sel); }
  function currentPage() {
    var p = window.location.pathname.split("/").pop();
    return p === "" ? "index.html" : p;
  }

  /* ---- theme: auto -> light -> dark, remembered ------------------------- */
  var THEMES = ["auto", "light", "dark"];
  function applyTheme(t) {
    if (t === "auto") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", t);
    try { localStorage.setItem("theme", t); } catch (e) {}
    var btn = q("[data-theme-btn]");
    if (btn) btn.textContent = t.toUpperCase();
  }
  function savedTheme() {
    try { return localStorage.getItem("theme") || "auto"; } catch (e) { return "auto"; }
  }

  /* ---- masthead + tabs -------------------------------------------------- */
  function renderMasthead() {
    var mount = q("[data-masthead]");
    if (!mount) return;
    var here = currentPage();
    mount.textContent = "";
    mount.className = "masthead";

    var name = el(here === "index.html" ? "h1" : "p", { class: "name", "data-enter": "1" });
    name.appendChild(el("a", { href: "index.html", text: "Malay Shah" }));
    var block = el("div", { style: "display:flex;flex-direction:column;gap:.2rem" }, [
      name,
      el("p", { class: "kicker", "data-enter": "2", text: "AI PLATFORM & LLM INFRASTRUCTURE \u00b7 SAN JOSE" }),
    ]);
    mount.appendChild(block);

    var tabs = el("nav", { class: "tabs", "data-enter": "3", "aria-label": "Sections" });
    SITE.nav.forEach(function (item) {
      var a = el("a", { href: item.href, text: item.label });
      if (item.href.split("#")[0] === here) a.setAttribute("aria-current", "page");
      tabs.appendChild(a);
    });
    var btn = el("button", { class: "theme-btn", type: "button", "data-theme-btn": "",
      "aria-label": "Change colour theme", text: savedTheme().toUpperCase() });
    btn.addEventListener("click", function () {
      applyTheme(THEMES[(THEMES.indexOf(savedTheme()) + 1) % THEMES.length]);
    });
    tabs.appendChild(btn);
    mount.appendChild(tabs);
  }

  function sectionHead(idx, title, moreHref, moreText) {
    var kids = [el("span", { class: "idx", text: idx }), el("h2", { text: title }),
      el("span", { class: "fill", "data-reveal": "rule" })];
    if (moreHref) kids.push(el("a", { class: "more", href: moreHref, text: moreText || "all \u2192" }));
    return el("div", { class: "sec-head" }, kids);
  }

  /* ---- home: hero, metrics, posts, work, roles, stack, pubs ------------- */
  function renderHero() {
    var mount = q("[data-hero]");
    if (!mount || !SITE.hero) return;
    mount.className = "hero";
    mount.textContent = "";
    mount.appendChild(el("p", { class: "lede", "data-enter": "4", html: SITE.hero.lede }));
    mount.appendChild(el("p", { class: "sub", text: SITE.hero.sub }));
    if (SITE.now && SITE.now.length) {
      mount.appendChild(el("div", { class: "nowline" }, [
        el("span", { class: "dot" }),
        el("span", { text: "Currently: " + SITE.now[0].text }),
      ]));
    }
  }

  function renderMetrics() {
    var mount = q("[data-metrics]");
    if (!mount) return;
    mount.textContent = "";
    mount.appendChild(sectionHead("01", "Things that moved"));
    var rows = el("div", { class: "readouts" });
    (SITE.metrics || []).forEach(function (m) {
      rows.appendChild(el("div", { class: "readout", "data-reveal": "row" }, [
        el("b", { text: m.big }), el("span", { text: m.note }),
      ]));
    });
    mount.appendChild(rows);
  }

  function postMeta(p) { return p.date + " \u00b7 " + p.read; }

  function renderRecentPosts() {
    var mount = q("[data-recent-posts]");
    if (!mount) return;
    mount.textContent = "";
    mount.appendChild(sectionHead("02", "From the notebook", "writing.html"));
    var list = el("div", { class: "postlist" });
    (SITE.posts || []).slice(0, 3).forEach(function (p) {
      list.appendChild(el("a", { class: "postcard", "data-reveal": "row", href: "post.html?p=" + p.slug }, [
        el("div", { class: "row" }, [
          el("span", { class: "t", text: p.title }),
          el("span", { class: "meta", text: postMeta(p) }),
        ]),
        el("span", { class: "blurb", text: p.blurb }),
      ]));
    });
    mount.appendChild(list);
  }

  var STATUS_TEXT = { active: "building", shipped: "shipped", research: "research", archived: "archived" };

  function projectCard(p, compact) {
    var top = el("div", { class: "card-top" }, [
      el("h3", { text: p.title }),
      el("span", { class: "chip", "data-status": p.status, text: STATUS_TEXT[p.status] || p.status }),
      el("span", { class: "where", text: [p.org, p.period].filter(Boolean).join(" \u00b7 ") }),
    ]);
    var parts = [top, el("p", { text: p.summary })];
    if (!compact && p.points && p.points.length) {
      var ul = el("ul", { class: "points" });
      p.points.forEach(function (pt) { ul.appendChild(el("li", { text: pt })); });
      parts.push(ul);
    }
    if (p.result) parts.push(el("p", { class: "result", text: p.result }));
    if (!compact && p.tech && p.tech.length) {
      var tech = el("div", { class: "tags" });
      p.tech.forEach(function (t) { tech.appendChild(el("i", { text: t })); });
      parts.push(tech);
    }
    if (p.links && p.links.length) {
      var links = el("div", { class: "card-links" });
      p.links.forEach(function (l) { links.appendChild(el("a", { href: l.href, rel: "noopener", text: l.label })); });
      parts.push(links);
    }
    return el("article", { class: "card", "data-reveal": "row", id: p.slug }, parts);
  }

  function renderFeatured() {
    var mount = q("[data-featured]");
    if (!mount) return;
    mount.textContent = "";
    mount.appendChild(sectionHead("02", "Selected work", "projects.html"));
    var work = el("div", { class: "work" });
    SITE.projects.filter(function (p) { return p.featured; }).slice(0, 4)
      .forEach(function (p) { work.appendChild(projectCard(p, true)); });
    mount.appendChild(work);
  }

  function renderRoles() {
    var mount = q("[data-roles]");
    if (!mount) return;
    mount.textContent = "";
    mount.appendChild(sectionHead("03", "Where I have been"));
    var roles = el("div", { class: "roles" });
    (SITE.roles || []).forEach(function (r) {
      var what = el("span", { class: "what", text: r.title + " " });
      if (r.org) what.appendChild(el("em", { text: r.org }));
      roles.appendChild(el("div", { class: "role-row", "data-reveal": "row" }, [
        el("span", { class: "when", text: r.when }), what, el("p", { text: r.body }),
      ]));
    });
    mount.appendChild(roles);
  }

  function renderStack() {
    var mount = q("[data-stack]");
    if (!mount) return;
    mount.textContent = "";
    mount.appendChild(sectionHead("04", "Tools I reach for"));
    var langs = el("div", { class: "langs" });
    (SITE.langs || []).forEach(function (l) {
      var fill = el("i", { "data-reveal": "rule", style: "width:" + l.pct + "%" });
      langs.appendChild(el("div", { class: "lang" }, [
        el("span", { text: l.name }),
        el("span", { class: "bar" }, [fill]),
        el("span", { class: "lvl", text: l.level }),
      ]));
    });
    mount.appendChild(langs);
    var groups = el("div", { class: "stack" });
    (SITE.stack || []).forEach(function (g) {
      groups.appendChild(el("div", { class: "group" }, [
        el("h3", { text: g.title }), el("p", { text: g.body }),
      ]));
    });
    mount.appendChild(groups);
  }

  function renderPubs() {
    var mount = q("[data-pubs]");
    if (!mount) return;
    mount.textContent = "";
    mount.appendChild(sectionHead("05", "Papers"));
    var pubs = el("div", { class: "pubs" });
    (SITE.pubs || []).forEach(function (p) {
      pubs.appendChild(el("div", { class: "pub" }, [
        el("b", { text: p.title }), el("span", { text: p.meta }),
      ]));
    });
    mount.appendChild(pubs);
  }

  /* ---- projects page: filterable list ---------------------------------- */
  function renderProjects() {
    var mount = q("[data-projects]");
    if (!mount) return;
    var filterBar = q("[data-filters]"), countEl = q("[data-count]"), active = "all";

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
      mount.className = "work";
      if (!shown.length) mount.appendChild(el("p", { class: "empty", text: "Nothing tagged " + active + " yet." }));
      else shown.forEach(function (p) { mount.appendChild(projectCard(p)); });
      if (countEl) countEl.textContent = shown.length + (shown.length === 1 ? " project" : " projects");
      if (filterBar) {
        Array.prototype.forEach.call(filterBar.querySelectorAll("button"), function (b) {
          b.setAttribute("aria-pressed", String(b.dataset.tag === active));
        });
      }
      observeReveals();
    }

    if (filterBar) {
      filterBar.textContent = "";
      ["all"].concat(tags).forEach(function (t) {
        var b = el("button", { type: "button", "data-tag": t, text: t, "aria-pressed": "false" });
        b.addEventListener("click", function () {
          active = t;
          draw();
          var url = t === "all" ? window.location.pathname
            : window.location.pathname + "?tag=" + encodeURIComponent(t);
          history.replaceState(null, "", url);
        });
        filterBar.appendChild(b);
      });
    }
    var wanted = new URLSearchParams(window.location.search).get("tag");
    if (wanted && tags.indexOf(wanted) !== -1) active = wanted;
    draw();
  }

  /* ---- writing index --------------------------------------------------- */
  function renderWriting() {
    var mount = q("[data-writing]");
    if (!mount) return;
    mount.textContent = "";
    mount.className = "postindex";
    (SITE.posts || []).forEach(function (p) {
      mount.appendChild(el("a", { class: "postrow", "data-reveal": "row", href: "post.html?p=" + p.slug }, [
        el("div", { class: "row", style: "display:flex;flex-wrap:wrap;gap:.6rem;align-items:baseline" }, [
          el("span", { class: "kind", text: p.kind }),
          el("span", { class: "meta", style: "font-family:var(--mono);font-size:.72rem;color:var(--faint);margin-left:auto", text: postMeta(p) }),
        ]),
        el("span", { class: "t", text: p.title }),
        el("span", { style: "font-size:.94rem;color:var(--soft)", text: p.blurb }),
      ]));
    });
  }

  /* ---- about / now ----------------------------------------------------- */
  function renderFacts() {
    var mount = q("[data-facts]");
    if (!mount) return;
    mount.textContent = "";
    mount.className = "facts";
    (SITE.facts || []).forEach(function (f) {
      mount.appendChild(el("div", { class: "fact" }, [
        el("span", { text: f.label }), el("span", { text: f.text }),
      ]));
    });
  }

  function renderNow() {
    var mount = q("[data-now]");
    if (!mount) return;
    mount.textContent = "";
    mount.className = "nowgrid";
    (SITE.now || []).forEach(function (n) {
      mount.appendChild(el("div", { class: "nowcard", "data-reveal": "row" }, [
        el("span", { text: n.label.toUpperCase() }), el("span", { text: n.text }),
      ]));
    });
  }

  /* ---- a single post: fetch the markdown file and render it ------------- */
  function renderPost() {
    var mount = q("[data-post]");
    if (!mount) return;
    var index = SITE.posts || [];
    /* No ?p= given: show the newest post. */
    var slug = new URLSearchParams(window.location.search).get("p") || (index[0] && index[0].slug);
    var at = -1;
    index.forEach(function (p, i) { if (p.slug === slug) at = i; });
    if (at === -1) {
      mount.appendChild(el("p", { class: "empty", html: 'No post by that name. <a href="writing.html">See all writing</a>.' }));
      return;
    }
    var meta = index[at];
    document.title = meta.title + " \u2014 Malay Shah";

    fetch("posts/" + slug + ".md").then(function (r) {
      if (!r.ok) throw new Error("missing file");
      return r.text();
    }).then(function (text) {
      var fm = window.MD.frontMatter(text);
      var doc = window.MD.render(fm.body);
      var m = fm.meta;
      mount.textContent = "";
      mount.className = "article";
      mount.appendChild(el("a", { class: "back", href: "writing.html", text: "\u2190 all writing" }));
      mount.appendChild(el("header", {}, [
        el("span", { class: "meta", text: [m.kind || meta.kind, m.date || meta.date, m.read || meta.read].join(" \u00b7 ") }),
        el("h1", { text: m.title || meta.title }),
        m.standfirst ? el("p", { class: "standfirst", text: m.standfirst }) : null,
      ]));
      mount.appendChild(el("div", { class: "body", html: doc.html }));

      var tags = m.tags || meta.tags || [];
      if (tags.length) {
        var tagRow = el("div", { class: "tags" });
        tags.forEach(function (t) { tagRow.appendChild(el("i", { text: t })); });
        mount.appendChild(tagRow);
      }

      if (doc.footnotes.length) {
        var fns = el("div", { class: "footnotes" }, [el("span", { class: "label", text: "NOTES" })]);
        doc.footnotes.forEach(function (f) {
          fns.appendChild(el("div", { class: "footnote", id: "fn-" + f.n }, [
            el("span", { class: "n", text: "[" + f.n + "]" }),
            el("span", { html: f.html }),
          ]));
        });
        mount.appendChild(fns);
      }

      var newer = index[at - 1], older = index[at + 1];
      var pager = el("div", { class: "pager" });
      pager.appendChild(older
        ? el("a", { href: "post.html?p=" + older.slug }, [
            el("span", { class: "lbl", text: "PREVIOUS" }),
            el("span", { class: "t", text: older.title }),
            el("span", { class: "meta", text: postMeta(older) }),
          ])
        : el("div", {}, [el("span", { class: "lbl", text: "PREVIOUS" }),
            el("span", { class: "t", text: "Nothing older yet" })]));
      pager.appendChild(newer
        ? el("a", { href: "post.html?p=" + newer.slug }, [
            el("span", { class: "lbl", text: "NEXT" }),
            el("span", { class: "t", text: newer.title }),
            el("span", { class: "meta", text: postMeta(newer) }),
          ])
        : el("div", {}, [el("span", { class: "lbl", text: "NEXT" }),
            el("span", { class: "t", text: "This is the latest" })]));
      mount.appendChild(pager);
      observeReveals();
    }).catch(function () {
      mount.textContent = "";
      mount.appendChild(el("p", { class: "empty",
        text: "Could not load posts/" + slug + ".md. Serve the site over HTTP (python -m http.server) rather than opening the file directly." }));
    });
  }

  /* ---- reveal fallback for browsers without scroll-driven animations ---- */
  var supportsTimeline = CSS && CSS.supports && CSS.supports("animation-timeline", "view()");
  var io = null;
  function observeReveals() {
    if (supportsTimeline) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!io) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.classList.add("seen");
          io.unobserve(e.target);
        });
      }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    }
    Array.prototype.forEach.call(document.querySelectorAll("[data-reveal]:not(.js-reveal)"), function (n) {
      n.classList.add("js-reveal");
      io.observe(n);
    });
  }

  /* ---- go -------------------------------------------------------------- */
  function init() {
    applyTheme(savedTheme());
    renderMasthead();
    renderHero();
    renderMetrics();
    renderRecentPosts();
    renderFeatured();
    renderRoles();
    renderStack();
    renderPubs();
    renderProjects();
    renderWriting();
    renderFacts();
    renderNow();
    renderPost();
    var year = q("[data-year]");
    if (year) year.textContent = String(new Date().getFullYear());
    observeReveals();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
