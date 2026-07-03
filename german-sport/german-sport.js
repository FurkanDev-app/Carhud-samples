/* ============================================================
   German Sport — analog hız göstergesi (bağımsız)
   Siyah kadran, ince DIN tipi beyaz rakamlar, ince kırmızı
   ibre, odometre penceresi. 0-280 km/h.

   window.GermanDial.set({ speed, odo })
     speed → km/h
     odo   → toplam km (odometre; isteğe bağlı)
   FiveM NUI mesajı (type: 'carhud') otomatik dinlenir.
   ============================================================ */

(function () {
  "use strict";

  var MAX = 280, START = 135, SWEEP = 270, C = 110;

  function $(sel, root) { return (root || document).querySelector(sel); }
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }

  function polar(cx, cy, r, deg) {
    var rad = (deg * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  var widget = $("#germanDial");
  if (widget) {
    var ticks = "";
    for (var v = 0; v <= MAX; v += 10) {
      var deg = START + (v / MAX) * SWEEP;
      var major = v % 40 === 0;
      var o = polar(C, C, 92, deg), p = polar(C, C, major ? 78 : 85, deg);
      ticks += '<line class="' + (major ? "" : "minor") + '" x1="' + o.x + '" y1="' + o.y +
               '" x2="' + p.x + '" y2="' + p.y + '"/>';
      if (major) {
        var t = polar(C, C, 63, deg);
        ticks += '<text x="' + t.x + '" y="' + (t.y + 6) + '" text-anchor="middle">' + v + "</text>";
      }
    }
    widget.innerHTML =
      '<svg viewBox="0 0 220 220">' +
      '<defs><radialGradient id="germanFace" cx="50%" cy="42%" r="72%">' +
      '<stop offset="0%" stop-color="#111214"/><stop offset="100%" stop-color="#050607"/>' +
      "</radialGradient></defs>" +
      '<circle class="an-bezel" cx="110" cy="110" r="105"/>' +
      '<circle cx="110" cy="110" r="98" fill="url(#germanFace)"/>' +
      '<g class="an-ticks">' + ticks + "</g>" +
      '<text class="an-unit" x="110" y="150" text-anchor="middle">km/h</text>' +
      '<rect class="ger-odo" x="80" y="158" width="60" height="16" rx="2"/>' +
      '<text class="ger-odoval" x="110" y="170" text-anchor="middle">000 000</text>' +
      '<g class="an-needle"><line class="an-needle-main" x1="110" y1="110" x2="28" y2="110"/>' +
      '<line class="an-needle-tail" x1="110" y1="110" x2="126" y2="110"/></g>' +
      '<circle class="an-hub" cx="110" cy="110" r="9"/>' +
      '<circle class="an-hub-core" cx="110" cy="110" r="4"/>' +
      "</svg>";
  }

  function set(d) {
    if (!widget) return;
    if (typeof d.speed === "number") {
      var kmh = clamp(d.speed, 0, MAX);
      // ibre batıya (180°) çizili; hedef = START + oran*SWEEP
      $(".an-needle", widget).style.transform =
        "rotate(" + (START + (kmh / MAX) * SWEEP - 180) + "deg)";
    }
    if (typeof d.odo === "number") {
      var s = String(clamp(Math.floor(d.odo), 0, 999999));
      while (s.length < 6) s = "0" + s;
      $(".ger-odoval", widget).textContent = s.slice(0, 3) + " " + s.slice(3);
    }
  }

  window.GermanDial = { set: set };

  /* ---------- FiveM NUI köprüsü ---------- */
  window.addEventListener("message", function (e) {
    var data = e.data;
    if (!data || data.type !== "carhud") return;
    set(data);
  });
})();
