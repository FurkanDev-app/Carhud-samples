/* ============================================================
   EV Gallery demo sürücüsü — sahte elektrikli sürüş verisi.
   FiveM'e taşırken bu dosyayı KALDIRIN; veri
   ev-gallery.js içindeki NUI listener'dan gelecek.
   ============================================================ */

(function () {
  "use strict";

  var t = 0;
  var battery = 76;

  setInterval(function () {
    t += 0.05;

    var speed = Math.max(0, 105 + 85 * Math.sin(t * 0.5) + 18 * Math.sin(t * 2.1));
    // hızlanırken pozitif güç, yavaşlarken rejen (türev yaklaşımı)
    var accel = 85 * 0.5 * Math.cos(t * 0.5) + 18 * 2.1 * Math.cos(t * 2.1);
    var power = accel * 5 + speed * 0.35;

    battery -= 0.008;
    if (battery <= 5) battery = 92;

    window.EvHud.set({
      speed: speed,
      power: power,
      battery: battery,
      range: battery * 4.2
    });
  }, 100);
})();
