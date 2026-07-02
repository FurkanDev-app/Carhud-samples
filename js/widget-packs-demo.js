/* ============================================================
   Widget Packs demo sürücüsü — sahte araç verisi.
   FiveM'e taşırken bu dosyayı KALDIRIN; veri
   widget-packs.js içindeki NUI listener'dan gelecek.
   ============================================================ */

(function () {
  "use strict";

  var t = 0;
  var fuel = 64;

  setInterval(function () {
    t += 0.05;

    var speed = 95 + 80 * Math.sin(t) + 15 * Math.sin(t * 3.7);
    speed = Math.max(0, speed);

    var gear = Math.min(6, Math.max(1, Math.floor(speed / 35) + 1));
    var rpm = 0.25 + ((speed % 35) / 35) * 0.72;

    fuel -= 0.02;
    if (fuel <= 0) fuel = 90;

    window.HudV2.setSpeed(speed);
    window.HudV2.setRpm(rpm);
    window.HudV2.setGear(gear);
    window.HudV2.setFuel(fuel);
  }, 100);
})();
