/* ============================================================
   Bike Gallery demo sürücüsü — sahte sürüş verisi.
   FiveM'e taşırken bu dosyayı KALDIRIN; veri
   bike-gallery.js içindeki NUI listener'dan gelecek.
   ============================================================ */

(function () {
  "use strict";

  var t = 0;
  var dist = 0, time = 0, battery = 84;
  var assist = 1, assistTimer = 0;

  setInterval(function () {
    t += 0.05;
    time += 0.1;

    var speed = Math.max(0, 27 + 12 * Math.sin(t * 0.6) + 4 * Math.sin(t * 2.3));
    dist += (speed / 3600) * 0.1;

    battery -= 0.006;
    if (battery <= 0) battery = 95;

    assistTimer += 0.1;
    if (assistTimer > 6) {
      assistTimer = 0;
      assist = (assist + 1) % 4;
    }

    window.BikeHud.set({
      speed: speed,
      hr: 128 + 26 * Math.sin(t * 0.35),
      power: Math.max(0, 165 + 130 * Math.sin(t * 0.5)),
      cadence: Math.max(0, 84 + 18 * Math.sin(t * 0.7)),
      elev: 1500 + 90 * Math.sin(t * 0.15),
      grade: 11 * Math.sin(t * 0.25),
      dist: dist,
      time: time,
      battery: battery,
      assist: assist
    });
  }, 100);
})();
