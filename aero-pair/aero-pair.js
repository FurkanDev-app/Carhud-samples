/* ============================================================
   Aero Pair — fotoğraflardaki 2 uçak widget'ı (önizleme)
     P01 Jet Compass      → dönen pusula gülü + jet silüeti
                            + kırmızı hedef işaretçisi
     P02 Annunciator Strip→ MOTOR / IŞIK / YAKIT / VİTES / STALL

   window.AeroPair.set({
     hdg,            → istikamet (derece)
     bug,            → kırmızı işaretçinin gösterdiği yön (derece)
     motor, isik, yakit, vites, → true yeşil | false sönük | 'red' kırmızı
     stall           → true = kırmızı blink
   })
   FiveM NUI mesajı (type: 'carhud') otomatik dinlenir.
   ============================================================ */

(function () {
  "use strict";

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return (root || document).querySelectorAll(sel); }

  function polar(cx, cy, r, deg) {
    var rad = (deg * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  /* ---------- P01 Jet Compass ---------- */

  var p01 = $("#p01");
  if (p01) {
    var CARD = { 0: "N", 90: "E", 180: "S", 270: "W" };
    var rose = "";
    for (var h = 0; h < 360; h += 5) {
      var d = -90 + h;
      var major = h % 10 === 0;
      var o = polar(110, 110, 100, d), p = polar(110, 110, major ? 89 : 94, d);
      rose += '<line class="' + (major ? "" : "minor") + '" x1="' + o.x + '" y1="' + o.y +
              '" x2="' + p.x + '" y2="' + p.y + '"/>';
      if (h % 30 === 0) {
        var lbl = CARD[h] !== undefined ? CARD[h] : String(h / 10);
        var tp = polar(110, 110, 72, d);
        rose += '<text class="' + (CARD[h] ? "card" : "") + '" x="' + tp.x + '" y="' + tp.y +
                '" text-anchor="middle" transform="rotate(' + h + " " + tp.x + " " + tp.y +
                ')" dy="6">' + lbl + "</text>";
      }
    }
    p01.innerHTML =
      '<svg viewBox="0 0 220 220">' +
      '<circle class="jc-face" cx="110" cy="110" r="106"/>' +
      '<g class="jc-rose">' + rose + "</g>" +
      // kırmızı hedef işaretçisi (bug) — merkez etrafında döner
      '<g class="jc-bug"><polygon points="66,110 82,102 82,118"/></g>' +
      // sabit jet silüeti (burun yukarı)
      '<path class="jc-jet" d="M110 58' +
      ' L114 66 L115 88 L152 106 L152 114 L115 106' +
      ' L114 128 L126 140 L126 146 L110 140' +
      ' L94 146 L94 140 L106 128 L105 106' +
      ' L68 114 L68 106 L105 88 L106 66 Z"/>' +
      "</svg>";
  }

  /* ---------- P02 Annunciator Strip ---------- */

  var p02 = $("#p02");
  var LIGHTS = ["motor", "isik", "yakit", "vites", "stall"];
  var LABELS = { motor: "MOTOR", isik: "I&Scedil;IK", yakit: "YAKIT", vites: "V&#304;TES", stall: "STALL" };
  if (p02) {
    var items = "";
    LIGHTS.forEach(function (k) {
      items +=
        '<div class="an-item" data-k="' + k + '">' +
        '<span class="an-led"></span>' +
        '<span class="an-label">' + LABELS[k] + "</span>" +
        "</div>";
    });
    p02.innerHTML = '<div class="an-panel">' + items + "</div>";
  }

  /* ============================================================
     Güncelleme API'si
     ============================================================ */

  var state = { hdg: 0, bug: 270, motor: true, isik: false, yakit: true, vites: true, stall: false };

  function setLight(key, val) {
    var item = $('.an-item[data-k="' + key + '"]', p02);
    if (!item) return;
    var led = $(".an-led", item);
    led.classList.remove("g", "r", "blink");
    if (val === true) led.classList.add(key === "stall" ? "r" : "g");
    if (val === "red") led.classList.add("r");
    if (key === "stall" && val === true) led.classList.add("blink");
  }

  function set(d) {
    Object.keys(state).forEach(function (k) {
      if (typeof d[k] !== "undefined") state[k] = d[k];
    });

    if (p01) {
      var hdg = ((state.hdg % 360) + 360) % 360;
      $(".jc-rose", p01).style.transform = "rotate(" + -hdg + "deg)";
      // bug göreli döner: gösterdiği gerçek yön - mevcut istikamet
      $(".jc-bug", p01).style.transform = "rotate(" + (state.bug - hdg) + "deg)";
    }

    if (p02) {
      LIGHTS.forEach(function (k) { setLight(k, state[k]); });
    }
  }

  window.AeroPair = { set: set };
  set({});

  /* ---------- FiveM NUI köprüsü ---------- */
  window.addEventListener("message", function (e) {
    var data = e.data;
    if (!data || data.type !== "carhud") return;
    set(data);
  });
})();
