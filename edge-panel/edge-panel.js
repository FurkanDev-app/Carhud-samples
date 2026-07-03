/* ============================================================
   Edge Panel — bisiklet bilgisayarı widget'ı (bağımsız)
   Referans: Garmin Edge — TRAIN / Elevation üstte,
   ortada dev Speed, altta Heart Rate + Power.

   window.EdgePanel.set({ speed, hr, power, elev })
   FiveM NUI mesajı (type: 'carhud') otomatik dinlenir.
   ============================================================ */

(function () {
  "use strict";

  function $(sel, root) { return (root || document).querySelector(sel); }
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }

  var BIKE_ICON =
    '<svg viewBox="0 0 44 28" class="bike-icon">' +
    '<circle cx="9" cy="19" r="7"/><circle cx="35" cy="19" r="7"/>' +
    '<path d="M9 19 L17 8 L28 8 M17 8 L22 19 L35 19 M22 19 L28 8 L31 4 M26 4 L31 4"/>' +
    "</svg>";

  var panel = $("#edgePanel");
  if (panel) {
    panel.innerHTML =
      '<div class="edge-frame"><div class="edge-screen">' +
      '<div class="edge-row">' +
      '<div class="edge-field"><span class="ef-label">TRAIN</span>' +
      '<span class="ef-icon">' + BIKE_ICON + "</span></div>" +
      '<div class="edge-field"><span class="ef-label">Elevation</span>' +
      '<span class="ef-val"><span class="eg-elev">0</span><small>FT</small></span></div>' +
      "</div>" +
      '<div class="edge-row big">' +
      '<div class="edge-field wide"><span class="ef-label">Speed</span>' +
      '<div class="ef-big"><span class="eg-speed">0.0</span><small>KM/H</small></div></div>' +
      "</div>" +
      '<div class="edge-row">' +
      '<div class="edge-field"><span class="ef-label">Heart Rate</span>' +
      '<span class="ef-val"><i class="eg-heart"></i><span class="eg-hr">0</span></span></div>' +
      '<div class="edge-field"><span class="ef-label">Power</span>' +
      '<span class="ef-val"><span class="eg-pwr">0</span><small>W</small></span></div>' +
      "</div>" +
      "</div></div>";
  }

  function set(d) {
    if (!panel) return;
    if (typeof d.speed === "number") {
      $(".eg-speed", panel).textContent = Math.max(0, d.speed).toFixed(1);
    }
    if (typeof d.elev === "number") {
      $(".eg-elev", panel).textContent = Math.round(d.elev);
    }
    if (typeof d.hr === "number") {
      $(".eg-hr", panel).textContent = clamp(Math.round(d.hr), 0, 230);
    }
    if (typeof d.power === "number") {
      $(".eg-pwr", panel).textContent = clamp(Math.round(d.power), 0, 1999);
    }
  }

  window.EdgePanel = { set: set };

  /* ---------- FiveM NUI köprüsü ---------- */
  window.addEventListener("message", function (e) {
    var data = e.data;
    if (!data || data.type !== "carhud") return;
    set(data);
  });
})();
