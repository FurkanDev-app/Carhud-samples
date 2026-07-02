/* ============================================================
   Classic Gauge — yeniden kullanılabilir bileşen
   Kullanım:
     <div class="js-classic-gauge theme-redline"></div>
     <script src="js/classic-gauge.js"></script>
   Tema, container'a verilen theme-* sınıfıyla seçilir
   (css/classic-gauge.css). data-max ile gösterge tavanı,
   data-unit ile birim etiketi değiştirilebilir.
   ============================================================ */

(function () {
  "use strict";

  var START = 135, SWEEP = 270, R_ARC = 118;
  var SVG_NS = "http://www.w3.org/2000/svg";
  var counter = 0;

  function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }

  function polar(cx, cy, r, deg) {
    var rad = (deg * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  function arcPath(cx, cy, r, startDeg, sweepDeg) {
    var s = polar(cx, cy, r, startDeg);
    var e = polar(cx, cy, r, startDeg + sweepDeg);
    var large = sweepDeg > 180 ? 1 : 0;
    return "M " + s.x + " " + s.y + " A " + r + " " + r + " 0 " + large + " 1 " + e.x + " " + e.y;
  }

  function el(name, attrs, parent) {
    var node = document.createElementNS(SVG_NS, name);
    for (var k in attrs) node.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(node);
    return node;
  }

  function createClassicGauge(container, opts) {
    opts = opts || {};
    var max = opts.maxSpeed || parseInt(container.dataset.max, 10) || 240;
    var unit = opts.unit || container.dataset.unit || "KM/H";
    var faceId = "cg-face-" + (++counter);

    container.classList.add("gauge-classic");

    var svg = el("svg", { viewBox: "0 0 300 300" }, container);

    // kadran yüzeyi — radyal gradyan (stop renkleri CSS var'dan gelir)
    var defs = el("defs", {}, svg);
    var grad = el("radialGradient", { id: faceId, cx: "50%", cy: "42%", r: "70%" }, defs);
    el("stop", { class: "cg-face-hi", offset: "0%" }, grad);
    el("stop", { class: "cg-face-mid", offset: "70%" }, grad);
    el("stop", { class: "cg-face-lo", offset: "100%" }, grad);

    el("circle", { cx: 150, cy: 150, r: 142, fill: "url(#" + faceId + ")" }, svg);
    el("circle", { class: "cg-bezel", cx: 150, cy: 150, r: 136, fill: "none" }, svg);
    el("circle", { class: "cg-inner", cx: 150, cy: 150, r: 128, fill: "none" }, svg);

    var d = arcPath(150, 150, R_ARC, START, SWEEP);
    el("path", { class: "cg-track", d: d, fill: "none", pathLength: 100 }, svg);
    var progress = el("path", {
      class: "cg-progress", d: d, fill: "none",
      pathLength: 100, "stroke-dasharray": "0 100"
    }, svg);

    // tick'ler: her 10'da çizgi, her 20'de kalın, her 40'ta rakam
    var ticks = el("g", { class: "cg-ticks" }, svg);
    var step = max / 24; // 240 → 10'luk adım oranı korunur
    for (var v = 0; v <= max; v += step) {
      var deg = START + (v / max) * SWEEP;
      var major = Math.round(v / step) % 2 === 0;
      var o = polar(150, 150, 108, deg);
      var i = polar(150, 150, major ? 98 : 102, deg);
      el("line", {
        class: major ? "cg-tick" : "cg-tick minor",
        x1: o.x, y1: o.y, x2: i.x, y2: i.y
      }, ticks);
      if (Math.round(v / step) % 4 === 0) {
        var tp = polar(150, 150, 84, deg);
        var num = el("text", {
          class: "cg-num", x: tp.x, y: tp.y + 5, "text-anchor": "middle"
        }, ticks);
        num.textContent = Math.round(v);
      }
    }

    var needle = el("g", { class: "cg-needle" }, svg);
    el("line", { class: "cg-needle-main", x1: 150, y1: 150, x2: 258, y2: 150 }, needle);
    el("line", { class: "cg-needle-tail", x1: 150, y1: 150, x2: 128, y2: 150 }, needle);
    el("circle", { class: "cg-hub", cx: 150, cy: 150, r: 9 }, svg);
    el("circle", { class: "cg-hub-core", cx: 150, cy: 150, r: 4 }, svg);

    var speedText = el("text", {
      class: "cg-speed", x: 150, y: 205, "text-anchor": "middle"
    }, svg);
    speedText.textContent = "0";
    var unitText = el("text", {
      class: "cg-unit", x: 150, y: 226, "text-anchor": "middle"
    }, svg);
    unitText.textContent = unit;

    return {
      el: container,
      setSpeed: function (val) {
        val = clamp(Math.round(val), 0, max);
        var pct = (val / max) * 100;
        progress.setAttribute("stroke-dasharray", pct + " 100");
        needle.style.transform = "rotate(" + (START + (val / max) * SWEEP) + "deg)";
        speedText.textContent = val;
      }
    };
  }

  window.createClassicGauge = createClassicGauge;

  /* ---------- otomatik kurulum + kayıt ---------- */

  var gauges = [];
  document.querySelectorAll(".js-classic-gauge").forEach(function (node) {
    gauges.push(createClassicGauge(node));
  });
  window.ClassicGauges = gauges;

  /* ---------- FiveM NUI köprüsü ----------
     SendNUIMessage({ type = 'carhud', speed = kmh }) */
  window.addEventListener("message", function (e) {
    var data = e.data;
    if (!data || data.type !== "carhud" || typeof data.speed !== "number") return;
    gauges.forEach(function (g) { g.setSpeed(data.speed); });
  });
})();
