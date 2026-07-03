/* ============================================================
   German Sport demo sürücüsü — sahte sürüş verisi.
   FiveM'e taşırken bu dosyayı KALDIRIN; veri
   german-sport.js içindeki NUI listener'dan gelecek.
   ============================================================ */

(function () {
  "use strict";

  var t = 0;
  var odo = 42137;

  setInterval(function () {
    t += 0.05;
    var speed = Math.max(0, 110 + 95 * Math.sin(t * 0.7) + 15 * Math.sin(t * 2.9));
    odo += speed / 36000;
    window.GermanDial.set({ speed: speed, odo: odo });
  }, 100);
})();
