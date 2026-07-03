/* ============================================================
   Fuel Dial demo sürücüsü — sahte yakıt verisi.
   FiveM'e taşırken bu dosyayı KALDIRIN; veri
   fuel-dial.js içindeki NUI listener'dan gelecek.
   ============================================================ */

(function () {
  "use strict";

  var fuel = 88;

  setInterval(function () {
    fuel -= 0.12;
    if (fuel <= 2) fuel = 95;
    window.FuelDial.set({ fuel: fuel });
  }, 100);
})();
