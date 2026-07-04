/* ============================================================
   ProStreet demo sürücüsü — sahte yarış verisi.
   FiveM'e taşırken bu dosyayı KALDIRIN; veri
   prostreet.js içindeki NUI listener'dan gelecek.
   ============================================================ */

(function () {
  "use strict";

  var t = 0;

  setInterval(function () {
    t += 0.05;
    var speed = Math.max(0, 145 + 110 * Math.sin(t * 0.55) + 18 * Math.sin(t * 2.3));
    var gear = Math.min(6, Math.max(1, Math.floor(speed / 48) + 1));
    window.ProStreet.set({
      speed: speed,
      rpm: 0.28 + ((speed % 48) / 48) * 0.7,
      gear: gear
    });
  }, 100);
})();
