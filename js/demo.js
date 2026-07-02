/* ============================================================
   Demo sürücüsü — sahte araç verisiyle widget'ları oynatır.
   FiveM'e taşırken bu dosyayı KALDIRIN; veriler NUI
   mesajından (hud.js içindeki listener) gelecek.
   ============================================================ */

(function () {
  "use strict";

  var t = 0;
  var fuel = 87;
  var engine = 100;
  var belt = true;

  setInterval(function () {
    t += 0.05;

    // hız: 0-190 arasında dalgalanan sahte sürüş profili
    var speed = 95 + 80 * Math.sin(t) + 15 * Math.sin(t * 3.7);
    speed = Math.max(0, speed);

    // rpm: hıza bağlı, vites geçişlerinde testere dişi
    var gear = Math.min(6, Math.max(1, Math.floor(speed / 35) + 1));
    var rpm = 0.25 + ((speed % 35) / 35) * 0.7;

    fuel = Math.max(0, fuel - 0.015);
    if (fuel <= 0) fuel = 90;

    engine -= 0.008;
    if (engine < 40) engine = 100;

    if (Math.random() < 0.004) belt = !belt;

    window.CarHud.setSpeed(speed);
    window.CarHud.setRpm(rpm);
    window.CarHud.setGear(gear);
    window.CarHud.setFuel(fuel);
    window.CarHud.setEngine(engine);
    window.CarHud.setSeatbelt(belt);
  }, 100);
})();
