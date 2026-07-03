/* ============================================================
   EV Arc demo sürücüsü — sahte elektrikli sürüş verisi.
   FiveM'e taşırken bu dosyayı KALDIRIN; veri
   ev-arc.js içindeki NUI listener'dan gelecek.
   ============================================================ */

(function () {
  "use strict";

  var t = 0;

  setInterval(function () {
    t += 0.05;
    var speed = Math.max(0, 105 + 85 * Math.sin(t * 0.5) + 18 * Math.sin(t * 2.1));
    var accel = 85 * 0.5 * Math.cos(t * 0.5) + 18 * 2.1 * Math.cos(t * 2.1);
    window.EvArc.set({
      speed: speed,
      power: accel * 5 + speed * 0.35
    });
  }, 100);
})();
