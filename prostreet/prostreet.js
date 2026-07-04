/* ============================================================
   ProStreet — açık kadranlı gerçekçi takometre (bağımsız)
   Açık gri kadran, siyah 0-9 rakamları, kırmızı ibre ve bölge,
   redline'da yanıp sönen SHIFT ışığı, yeşil LCD hız penceresi,
   vites göstergesi.

   window.ProStreet.set({ speed, rpm, gear })
     speed → km/h · rpm → 0-1 · gear → vites
   FiveM NUI mesajı (type: 'carhud') otomatik dinlenir.
   ============================================================ */

(function () {
  "use strict";

  var C = 125, START = 135, SWEEP = 270;

  function $(sel, root) { return (root || document).querySelector(sel); }
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }

  function polar(cx, cy, r, deg) {
    var rad = (deg * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }
  function arc(cx, cy, r, start, sweep) {
    var s = polar(cx, cy, r, start), e = polar(cx, cy, r, start + sweep);
    return "M " + s.x + " " + s.y + " A " + r + " " + r + " 0 " +
           (Math.abs(sweep) > 180 ? 1 : 0) + " 1 " + e.x + " " + e.y;
  }

  var widget = $("#proStreet");
  if (widget) {
    var html = '<svg viewBox="0 0 250 250">';
    html += '<defs><radialGradient id="psFace" cx="50%" cy="42%" r="72%">' +
            '<stop offset="0%" stop-color="#e9ebee"/><stop offset="100%" stop-color="#c6cad0"/>' +
            "</radialGradient></defs>";
    html += '<circle cx="' + C + '" cy="' + C + '" r="104" fill="#22252a"/>' +
            '<circle cx="' + C + '" cy="' + C + '" r="97" fill="url(#psFace)"/>';
    // kırmızı bölge (son %10)
    html += '<path d="' + arc(C, C, 86, START + SWEEP * 0.9, SWEEP * 0.1) +
            '" fill="none" stroke="#d2352a" stroke-width="7"/>';
    // tick + rakamlar 0-9
    for (var v = 0; v <= 9; v++) {
      var deg = START + (v / 9) * SWEEP;
      var o = polar(C, C, 90, deg), p = polar(C, C, 80, deg);
      html += '<line class="ps-tick" x1="' + o.x + '" y1="' + o.y +
              '" x2="' + p.x + '" y2="' + p.y + '"/>';
      var t = polar(C, C, 66, deg);
      html += '<text class="ps-num" x="' + t.x + '" y="' + (t.y + 4) +
              '" text-anchor="middle">' + v + "</text>";
    }
    // SHIFT ışığı
    html += '<rect class="ps-shift" x="' + (C - 26) + '" y="' + (C - 44) +
            '" width="52" height="15" rx="3"/>' +
            '<text class="ps-shifttext" x="' + C + '" y="' + (C - 32.5) +
            '" text-anchor="middle">SHIFT</text>';
    // ibre
    html += '<g class="ps-needle"><g transform="translate(' + C + " " + C + ')">' +
            '<polygon points="-14,-3 72,-1.5 84,0 72,1.5 -14,3" fill="#d2352a"/></g></g>' +
            '<circle cx="' + C + '" cy="' + C + '" r="8" fill="#22252a"/>';
    // LCD hız + vites
    html += '<rect x="' + (C - 38) + '" y="' + (C + 34) + '" width="76" height="22" rx="3" fill="#15181c"/>' +
            '<text class="ps-speed" x="' + C + '" y="' + (C + 50) + '" text-anchor="middle">0</text>' +
            '<text class="ps-unit" x="' + C + '" y="' + (C + 72) + '" text-anchor="middle">km/h &bull; ' +
            '<tspan class="ps-gear">N</tspan></text>';
    html += "</svg>";
    widget.innerHTML = html;

    var needle = $(".ps-needle", widget);
    needle.style.transformOrigin = C + "px " + C + "px";
  }

  function set(d) {
    if (!widget) return;
    if (typeof d.rpm === "number") {
      var r = clamp(d.rpm, 0, 1);
      $(".ps-needle", widget).style.transform = "rotate(" + (START + r * SWEEP) + "deg)";
      widget.classList.toggle("shift", r > 0.85);
    }
    if (typeof d.speed === "number") {
      $(".ps-speed", widget).textContent = Math.round(clamp(d.speed, 0, 999));
    }
    if (typeof d.gear === "number") {
      $(".ps-gear", widget).textContent =
        d.gear === 0 ? "R" : d.gear === -1 ? "N" : String(d.gear);
    }
  }

  window.ProStreet = { set: set };

  /* ---------- FiveM NUI köprüsü ---------- */
  window.addEventListener("message", function (e) {
    var data = e.data;
    if (!data || data.type !== "carhud") return;
    set(data);
  });
})();
