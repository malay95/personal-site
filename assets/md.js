/* ==========================================================================
   md.js - a very small markdown renderer. No dependencies.
   Supports what the posts actually use:
     # ## ###            headings
     paragraphs          blank-line separated
     ```lang ... ```     fenced code
     > quote             blockquote
     - item              unordered list
     :::note ... :::     callout box
     **bold** *em* `code` [text](url)
     [^1] and [^1]: ...  footnotes
   Front matter is a YAML-ish block at the top: key: value, one per line.
   ========================================================================== */
(function () {
  "use strict";

  function esc(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function inline(s) {
    var out = esc(s);
    out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
    out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    out = out.replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>");
    out = out.replace(/\[\^(\d+)\]/g, function (m, n) {
      return '<a class="fnref" id="fnref-' + n + '" href="#fn-' + n + '">[' + n + "]</a>";
    });
    out = out.replace(/\[([^\]]+)\]\((https?:[^)\s]+)\)/g, '<a href="$2" rel="noopener">$1</a>');
    return out;
  }

  /* Splits front matter from body. Returns { meta, body }. */
  function frontMatter(text) {
    var meta = {}, body = text;
    var m = /^---\s*\n([\s\S]*?)\n---\s*\n?/.exec(text);
    if (m) {
      m[1].split(/\n/).forEach(function (line) {
        var i = line.indexOf(":");
        if (i === -1) return;
        var key = line.slice(0, i).trim();
        var val = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
        if (val.charAt(0) === "[") {
          val = val.slice(1, -1).split(",").map(function (t) { return t.trim().replace(/^["']|["']$/g, ""); })
            .filter(Boolean);
        }
        meta[key] = val;
      });
      body = text.slice(m[0].length);
    }
    return { meta: meta, body: body };
  }

  /* Renders body markdown to { html, footnotes: [{n, html}] }. */
  function render(src) {
    var lines = src.replace(/\r\n/g, "\n").split("\n");
    var html = [], footnotes = [], i = 0;

    function flushList(items) {
      html.push("<ul>" + items.map(function (t) { return "<li>" + inline(t) + "</li>"; }).join("") + "</ul>");
    }

    while (i < lines.length) {
      var line = lines[i];

      if (!line.trim()) { i++; continue; }

      var fn = /^\[\^(\d+)\]:\s*(.*)$/.exec(line);
      if (fn) { footnotes.push({ n: fn[1], html: inline(fn[2]) }); i++; continue; }

      if (line.slice(0, 3) === "```") {
        var code = [];
        i++;
        while (i < lines.length && lines[i].slice(0, 3) !== "```") { code.push(lines[i]); i++; }
        i++;
        html.push("<pre><code>" + esc(code.join("\n")) + "</code></pre>");
        continue;
      }

      if (line.slice(0, 6) === ":::not") {
        var note = [];
        i++;
        while (i < lines.length && lines[i].trim() !== ":::") { note.push(lines[i]); i++; }
        i++;
        html.push('<div class="note">' + inline(note.join(" ")) + "</div>");
        continue;
      }

      var h = /^(#{1,3})\s+(.*)$/.exec(line);
      if (h) { var lv = h[1].length + 1; html.push("<h" + lv + ">" + inline(h[2]) + "</h" + lv + ">"); i++; continue; }

      if (line.charAt(0) === ">") {
        var quote = [];
        while (i < lines.length && lines[i].charAt(0) === ">") { quote.push(lines[i].replace(/^>\s?/, "")); i++; }
        html.push("<blockquote>" + inline(quote.join(" ")) + "</blockquote>");
        continue;
      }

      if (/^[-*]\s+/.test(line)) {
        var items = [];
        while (i < lines.length && /^[-*]\s+/.test(lines[i])) { items.push(lines[i].replace(/^[-*]\s+/, "")); i++; }
        flushList(items);
        continue;
      }

      var para = [];
      while (i < lines.length && lines[i].trim() && !/^(#{1,3}\s|>|[-*]\s|```|:::)/.test(lines[i])
             && !/^\[\^\d+\]:/.test(lines[i])) { para.push(lines[i]); i++; }
      html.push("<p>" + inline(para.join(" ")) + "</p>");
    }

    return { html: html.join("\n"), footnotes: footnotes };
  }

  window.MD = { frontMatter: frontMatter, render: render };
})();
