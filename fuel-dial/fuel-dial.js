/* ============================================================
   Fuel Dial — uçak yakıt göstergesi (bağımsız, tek kadran)
   Klasik E &ndash; 1/2 &ndash; F skalası, tek ibre.

   window.FuelDial.set({ fuel })   → fuel: 0-100 (%)
   FiveM NUI mesajı (type: 'carhud') otomatik dinlenir.
   ============================================================ */

(function () {
  "use strict";

  /* skala: E (210°) → F (330°), 120° süpürme */
  var START = 210, SWEEP = 120;

  function $(sel, root) { return (root || document).querySelector(sel); }
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }

  function polar(cx, cy, r, deg) {
    var rad = (deg * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  var widget = $("#fuelDial");
  if (widget) {
    var ticks = "";
    var labels = ["E", "", "1/2", "", "F"];
    for (var i = 0; i <= 4; i++) {
      var deg = START + (i / 4) * SWEEP;
      var major = i % 2 === 0;
      var o = polar(100, 100, 84, deg), p = polar(100, 100, major ? 70 : 75, deg);
      ticks += '<line class="' + (major ? "" : "minor") + '" x1="' + o.x + '" y1="' + o.y +
               '" x2="' + p.x + '" y2="' + p.y + '"/>';
      if (labels[i]) {
        var t = polar(100, 100, 56, deg);
        ticks += '<text x="' + t.x + '" y="' + (t.y + 5) + '" text-anchor="middle">' + labels[i] + "</text>";
      }
    }
    widget.innerHTML =
      '<svg viewBox="0 0 200 200">' +
      '<circle class="fd-face" cx="100" cy="100" r="94"/>' +
      '<circle class="fd-bezel" cx="100" cy="100" r="94"/>' +
      '<g class="fd-ticks">' + ticks + "</g>" +
      '<text class="fd-label" x="100" y="138" text-anchor="middle">FUEL</text>' +
      '<g class="fd-needle"><line x1="100" y1="100" x2="24" y2="100"/></g>' +
      '<circle class="fd-hub" cx="100" cy="100" r="7"/>' +
      "</svg>";
  }

  function set(d) {
    if (!widget || typeof d.fuel !== "number") return;
    var pct = clamp(d.fuel, 0, 100) / 100;
    // ibre batıya (180°) çizili; hedef açı START + pct*SWEEP
    widget.querySelector(".fd-needle").style.transform =
      "rotate(" + (START + pct * SWEEP - 180) + "deg)";
    widget.classList.toggle("low", pct < 0.15);
  }

  window.FuelDial = { set: set };

  /* ---------- FiveM NUI köprüsü ---------- */
  window.addEventListener("message", function (e) {
    var data = e.data;
    if (!data || data.type !== "carhud") return;
    set(data);
  });
})();
