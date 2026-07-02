/* ============================================================
   Cockpit Gallery demo sürücüsü — sahte uçuş verisi.
   FiveM'e taşırken bu dosyayı KALDIRIN; veri
   cockpit-gallery.js içindeki NUI listener'dan gelecek.
   ============================================================ */

(function () {
  "use strict";

  var t = 0;
  var prevAlt = null;
  var fuelL = 2450, fuelR = 2380;
  var gearStates = ["down", "transit", "up", "transit"];
  var gearIdx = 0, gearTimer = 0;

  setInterval(function () {
    t += 0.1;

    var alt = 3600 + 2400 * Math.sin(t * 0.11);
    var vs = prevAlt === null ? 0 : (alt - prevAlt) * 600; // 100ms → ft/min
    prevAlt = alt;

    fuelL = Math.max(0, fuelL - 0.35);
    fuelR = Math.max(0, fuelR - 0.32);
    if (fuelL < 150) { fuelL = 2450; fuelR = 2380; }

    gearTimer += 0.1;
    if (gearTimer > 5) {
      gearTimer = 0;
      gearIdx = (gearIdx + 1) % gearStates.length;
    }

    var flapsPhase = (Math.sin(t * 0.07) + 1) / 2;
    var flaps = [0, 10, 20, 35][Math.min(3, Math.floor(flapsPhase * 4))];

    window.FlightHud.set({
      alt: alt,
      vs: vs,
      pitch: 9 * Math.sin(t * 0.3),
      roll: 26 * Math.sin(t * 0.17),
      hdg: (t * 9) % 360,
      slip: 0.7 * Math.sin(t * 0.5),
      aoa: 9 + 5 * Math.sin(t * 0.23),
      g: 1 + 2.4 * Math.sin(t * 0.19),
      n1: 82 + 22 * Math.sin(t * 0.2),
      egt: 560 + 260 * Math.sin(t * 0.2),
      fuelL: fuelL,
      fuelR: fuelR,
      oilP: 62 + 9 * Math.sin(t * 0.4),
      oilT: 88 + 14 * Math.sin(t * 0.15),
      flaps: flaps,
      gear: gearStates[gearIdx],
      thr: 68 + 30 * Math.sin(t * 0.2),
      ra: Math.max(0, alt - 2600)
    });
  }, 100);
})();
