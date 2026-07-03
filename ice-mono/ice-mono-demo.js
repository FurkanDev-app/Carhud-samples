/* ============================================================
   Ice Mono demo sürücüsü — sahte yarış verisi.
   FiveM'e taşırken bu dosyayı KALDIRIN; veri
   ice-mono.js içindeki NUI listener'dan gelecek.
   ============================================================ */

(function () {
  "use strict";

  var t = 0;

  setInterval(function () {
    t += 0.05;
    var speed = Math.max(0, 150 + 115 * Math.sin(t * 0.55) + 20 * Math.sin(t * 2.3));
    var rpm = 0.28 + ((speed % 50) / 50) * 0.7;
    window.IceMono.set({
      speed: speed,
      rpm: rpm,
      throttle: Math.max(0, 0.5 + 0.5 * Math.sin(t * 1.1))
    });
  }, 100);
})();
