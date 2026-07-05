/* ============================================================
   Side Pill — mini analog kadran + dijital hız kapsülü
   (bağımsız, modern/sade FiveM göstergesi)

   window.SidePill.set({ speed, gear })
     speed → km/h · gear → vites
   FiveM NUI mesajı (type: 'carhud') otomatik dinlenir.
   ============================================================ */

(function () {
  "use strict";

  var MAX = 260, START = 135, SWEEP = 270, C = 40;

  function $(sel, root) { return (root || document).querySelector(sel); }
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }

  function polar(cx, cy, r, deg) {
    var rad = (deg * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  var widget = $("#sidePill");
  if (widget) {
    var ticks = "";
    for (var v = 0; v <= MAX; v += 65) {
      var deg = START + (v / MAX) * SWEEP;
      var o = polar(C, C, 34, deg), p = polar(C, C, 28, deg);
      ticks += '<line class="sp-tick" x1="' + o.x + '" y1="' + o.y +
               '" x2="' + p.x + '" y2="' + p.y + '"/>';
    }
    widget.innerHTML =
      '<div class="sp-pill">' +
      '<svg viewBox="0 0 80 80" class="sp-dial">' +
      '<circle cx="' + C + '" cy="' + C + '" r="37" class="sp-dialbg"/>' + ticks +
      '<g class="sp-needle"><g transform="translate(' + C + " " + C + ')">' +
      '<line class="sp-needleline" x1="-5" y1="0" x2="29" y2="0"/></g></g>' +
      '<circle cx="' + C + '" cy="' + C + '" r="3" class="sp-hub"/>' +
      "</svg>" +
      '<div class="sp-mid"><div class="sp-row"><span class="sp-speed">0</span>' +
      '<span class="sp-unit">KM/H</span></div>' +
      '<span class="sp-gear">Vites N</span></div>' +
      "</div>";

    var needle = $(".sp-needle", widget);
    needle.style.transformOrigin = C + "px " + C + "px";
  }

  function set(d) {
    if (!widget) return;
    if (typeof d.speed === "number") {
      var s = clamp(d.speed, 0, MAX);
      $(".sp-needle", widget).style.transform =
        "rotate(" + (START + (s / MAX) * SWEEP) + "deg)";
      $(".sp-speed", widget).textContent = Math.round(s);
    }
    if (typeof d.gear === "number") {
      $(".sp-gear", widget).textContent =
        "Vites " + (d.gear === 0 ? "R" : d.gear === -1 ? "N" : String(d.gear));
    }
  }

  window.SidePill = { set: set };

  /* ---------- FiveM NUI köprüsü ---------- */
  window.addEventListener("message", function (e) {
    var data = e.data;
    if (!data || data.type !== "carhud") return;
    set(data);
  });
})();
