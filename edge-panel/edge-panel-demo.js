/* ============================================================
   Edge Panel demo sürücüsü — sahte sürüş verisi.
   FiveM'e taşırken bu dosyayı KALDIRIN; veri
   edge-panel.js içindeki NUI listener'dan gelecek.
   ============================================================ */

(function () {
  "use strict";

  var t = 0;

  setInterval(function () {
    t += 0.05;
    window.EdgePanel.set({
      speed: Math.max(0, 27 + 12 * Math.sin(t * 0.6) + 4 * Math.sin(t * 2.3)),
      hr: 128 + 26 * Math.sin(t * 0.35),
      power: Math.max(0, 165 + 130 * Math.sin(t * 0.5)),
      elev: 1500 + 90 * Math.sin(t * 0.15)
    });
  }, 100);
})();
