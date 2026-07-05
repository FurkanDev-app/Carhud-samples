/* ============================================================
   Side Pill demo sürücüsü — sahte sürüş verisi.
   FiveM'e taşırken bu dosyayı KALDIRIN; veri
   side-pill.js içindeki NUI listener'dan gelecek.
   ============================================================ */

(function () {
  "use strict";

  var t = 0;

  setInterval(function () {
    t += 0.05;
    var speed = Math.max(0, 105 + 85 * Math.sin(t * 0.55) + 15 * Math.sin(t * 2.3));
    var gear = Math.min(6, Math.max(1, Math.floor(speed / 40) + 1));
    window.SidePill.set({ speed: speed, gear: gear });
  }, 100);
})();
