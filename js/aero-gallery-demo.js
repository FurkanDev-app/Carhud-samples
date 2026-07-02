/* ============================================================
   Aero Gallery demo sürücüsü — sahte uçuş hız profili (knot).
   FiveM'e taşırken bu dosyayı KALDIRIN; veri
   aero-gallery.js içindeki NUI listener'dan gelecek.
   ============================================================ */

(function () {
  "use strict";

  var t = 0;

  setInterval(function () {
    t += 0.04;
    // 40-380 kt arasında salınan uçuş profili
    var kts = 210 + 150 * Math.sin(t) + 25 * Math.sin(t * 3.1);
    window.AeroHud.setSpeed(Math.max(0, kts));
  }, 100);
})();
