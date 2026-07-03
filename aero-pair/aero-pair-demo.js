/* ============================================================
   Aero Pair demo sürücüsü — sahte veri.
   FiveM'e taşırken bu dosyayı KALDIRIN.
   ============================================================ */

(function () {
  "use strict";

  var t = 0;
  var phaseTimer = 0;
  var lights = { motor: true, isik: "red", yakit: true, vites: true, stall: false };

  setInterval(function () {
    t += 0.1;
    phaseTimer += 0.1;

    // her 5 saniyede ışık durumlarını karıştır
    if (phaseTimer > 5) {
      phaseTimer = 0;
      lights.motor = Math.random() > 0.15;
      lights.isik = Math.random() > 0.5 ? true : "red";
      lights.yakit = Math.random() > 0.2 ? true : "red";
      lights.vites = Math.random() > 0.15;
      lights.stall = Math.random() > 0.7;
    }

    window.AeroPair.set({
      hdg: (t * 6) % 360,
      bug: 270,
      motor: lights.motor,
      isik: lights.isik,
      yakit: lights.yakit,
      vites: lights.vites,
      stall: lights.stall
    });
  }, 100);
})();
