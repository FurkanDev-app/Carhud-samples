/* ============================================================
   Speed Gallery demo sürücüsü — sahte hız profili.
   FiveM'e taşırken bu dosyayı KALDIRIN; veri
   speed-gallery.js içindeki NUI listener'dan gelecek.
   ============================================================ */

(function () {
  "use strict";

  var t = 0;

  setInterval(function () {
    t += 0.05;
    var speed = 95 + 80 * Math.sin(t) + 15 * Math.sin(t * 3.7);
    window.SpeedHud.setSpeed(Math.max(0, speed));
  }, 100);
})();
