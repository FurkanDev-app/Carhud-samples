/* ============================================================
   EV Arc — elektrikli araç hız göstergesi (bağımsız)
   270° turkuaz yay + dijital hız + anlık kW okuması.

   window.EvArc.set({ speed, power })
     speed → km/h
     power → kW (negatif = rejeneratif frenleme)
   FiveM NUI mesajı (type: 'carhud') otomatik dinlenir.
   ============================================================ */

(function () {
  "use strict";

  var MAX_SPEED = 260; // km/h — gösterge tavanı

  function $(sel, root) { return (root || document).querySelector(sel); }
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }

  function polar(cx, cy, r, deg) {
    var rad = (deg * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }
  function arc(cx, cy, r, start, sweep) {
    var s = polar(cx, cy, r, start), e = polar(cx, cy, r, start + sweep);
    return "M " + s.x + " " + s.y + " A " + r + " " + r + " 0 " +
           (sweep > 180 ? 1 : 0) + " 1 " + e.x + " " + e.y;
  }

  var widget = $("#evArc");
  if (widget) {
    var d = arc(100, 100, 82, 135, 270);
    widget.innerHTML =
      '<svg viewBox="0 0 200 200">' +
      '<path class="ta-track" d="' + d + '" pathLength="100"/>' +
      '<path class="ta-progress" d="' + d + '" pathLength="100" stroke-dasharray="0 100"/>' +
      '<text class="ta-speed" x="100" y="102" text-anchor="middle">0</text>' +
      '<text class="ta-unit" x="100" y="122" text-anchor="middle">KM/H</text>' +
      '<text class="ta-kw" x="100" y="150" text-anchor="middle">0 kW</text>' +
      "</svg>";
  }

  function set(d) {
    if (!widget) return;
    if (typeof d.speed === "number") {
      var spd = clamp(Math.round(d.speed), 0, 999);
      var pct = clamp(spd / MAX_SPEED, 0, 1) * 100;
      $(".ta-speed", widget).textContent = spd;
      $(".ta-progress", widget).setAttribute("stroke-dasharray", pct + " 100");
    }
    if (typeof d.power === "number") {
      var kwEl = $(".ta-kw", widget);
      kwEl.textContent = Math.round(d.power) + " kW";
      kwEl.classList.toggle("regen", d.power < -1);
    }
  }

  window.EvArc = { set: set };

  /* ---------- FiveM NUI köprüsü ---------- */
  window.addEventListener("message", function (e) {
    var data = e.data;
    if (!data || data.type !== "carhud") return;
    set(data);
  });
})();
