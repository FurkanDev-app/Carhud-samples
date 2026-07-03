/* ============================================================
   Selected Widgets demo sürücüsü — sahte veri.
   FiveM'e taşırken bu dosyayı KALDIRIN; veri
   selected.js içindeki NUI listener'dan gelecek.
   ============================================================ */

(function () {
  "use strict";

  var t = 0;

  setInterval(function () {
    t += 0.05;

    window.SelectedHud.set({
      speed: Math.max(0, 95 + 80 * Math.sin(t) + 15 * Math.sin(t * 3.7)),
      alt: 3600 + 2400 * Math.sin(t * 0.22),
      pitch: 9 * Math.sin(t * 0.6),
      roll: 26 * Math.sin(t * 0.34),
      slip: 0.7 * Math.sin(t)
    });
  }, 100);
})();
