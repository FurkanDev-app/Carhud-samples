/* ============================================================
   Classic Gauge demo sürücüsü — tüm gauge'ları sahte hızla
   oynatır. FiveM'e taşırken bu dosyayı KALDIRIN; veri
   classic-gauge.js içindeki NUI listener'dan gelecek.
   ============================================================ */

(function () {
  "use strict";

  var t = 0;

  setInterval(function () {
    t += 0.05;
    var speed = 95 + 80 * Math.sin(t) + 15 * Math.sin(t * 3.7);
    speed = Math.max(0, speed);
    window.ClassicGauges.forEach(function (g) { g.setSpeed(speed); });
  }, 100);
})();
