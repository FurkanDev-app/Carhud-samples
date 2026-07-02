/* ============================================================
   Widget Packs — 3 widget × 5 tasarım
   A: Speed  (Horizon, Tower, Hex, Blade, Orbit)
   B: Fuel   (Ring, Tube, Cells, Quarter, Pill)
   C: RPM    (Tach, Shift Lights, Gear Ladder, Equalizer, Core)

   Hepsi window.HudV2 API'siyle beslenir; FiveM NUI mesajı
   (type: 'carhud') otomatik dinlenir. Kullanmayacağınız
   tasarımın HTML bloğunu silmeniz yeterli.
   ============================================================ */

(function () {
  "use strict";

  var MAX_SPEED = 240;

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return (root || document).querySelectorAll(sel); }
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }

  function polar(cx, cy, r, deg) {
    var rad = (deg * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }
  function arc(cx, cy, r, start, sweep) {
    var s = polar(cx, cy, r, start), e = polar(cx, cy, r, start + sweep);
    return "M " + s.x + " " + s.y + " A " + r + " " + r + " 0 " +
           (sweep > 180 ? 1 : 0) + " 1 " + e.x + " " + e.y;
  }

  /* ============================================================
     PACK A — SPEED
     ============================================================ */

  /* A1 — Horizon: 180° yarım yay, ortada dijital hız */
  var horizon = $("#spdHorizon");
  if (horizon) {
    var hTicks = "";
    for (var v = 0; v <= MAX_SPEED; v += 20) {
      var deg = 180 + (v / MAX_SPEED) * 180;
      var o = polar(150, 145, 106, deg);
      var i2 = polar(150, 145, v % 40 === 0 ? 96 : 100, deg);
      hTicks += '<line class="' + (v % 40 ? "minor" : "") + '" x1="' + o.x +
                '" y1="' + o.y + '" x2="' + i2.x + '" y2="' + i2.y + '"/>';
      if (v % 120 === 0) {
        var tp = polar(150, 145, 80, deg);
        hTicks += '<text x="' + tp.x + '" y="' + (tp.y + 4) +
                  '" text-anchor="middle">' + v + "</text>";
      }
    }
    var hD = arc(150, 145, 118, 180, 180);
    horizon.innerHTML =
      '<svg viewBox="0 0 300 165">' +
      '<path class="h-track" d="' + hD + '" pathLength="100"/>' +
      '<path class="h-progress" d="' + hD + '" pathLength="100" stroke-dasharray="0 100"/>' +
      '<g class="h-ticks">' + hTicks + "</g>" +
      '<text class="h-speed" x="150" y="120" text-anchor="middle">0</text>' +
      '<text class="h-unit" x="150" y="142" text-anchor="middle">KM/H</text>' +
      "</svg>";
  }

  /* A2 — Tower: alttan dolan dikey slat bar (üst 4 kırmızı bölge) */
  var tower = $("#spdTower");
  if (tower) {
    var slats = "";
    for (var s1 = 0; s1 < 16; s1++) {
      slats += '<div class="t-slat' + (s1 >= 12 ? " red" : "") + '"></div>';
    }
    tower.innerHTML =
      '<div class="t-bar">' + slats + "</div>" +
      '<div class="t-readout"><span class="t-speed">0</span>' +
      '<span class="t-unit">KM/H</span></div>';
  }

  /* A3 — Hex: altıgen panel, altta mikro progress */
  var hex = $("#spdHex");
  if (hex) {
    hex.innerHTML =
      '<div class="hx-outer"><div class="hx-inner">' +
      '<span class="hx-speed">0</span><span class="hx-unit">KM/H</span>' +
      '<div class="hx-track"><div class="hx-fill"></div></div>' +
      "</div></div>";
  }

  /* A4 — Blade: italik gradyan rakam + dolum çizgisi */
  var blade = $("#spdBlade");
  if (blade) {
    blade.innerHTML =
      '<div class="bl-row"><span class="bl-speed">0</span>' +
      '<span class="bl-unit">KM/H</span></div>' +
      '<div class="bl-track"><div class="bl-fill"></div></div>';
  }

  /* A5 — Orbit: 24 noktalı halka (son 4 kırmızı bölge) */
  var orbit = $("#spdOrbit");
  if (orbit) {
    var dots = "", N_DOTS = 24;
    for (var d1 = 0; d1 < N_DOTS; d1++) {
      var p = polar(100, 100, 82, 135 + (d1 / (N_DOTS - 1)) * 270);
      dots += '<circle class="o-dot' + (d1 >= N_DOTS - 4 ? " red" : "") +
              '" cx="' + p.x + '" cy="' + p.y + '" r="4.5"/>';
    }
    orbit.innerHTML =
      '<svg viewBox="0 0 200 200">' + dots +
      '<text class="o-speed" x="100" y="108" text-anchor="middle">0</text>' +
      '<text class="o-unit" x="100" y="130" text-anchor="middle">KM/H</text>' +
      "</svg>";
  }

  /* ============================================================
     PACK B — FUEL
     ============================================================ */

  /* B1 — Ring: tam halka, ortada ikon + yüzde */
  var fring = $("#fuelRing");
  if (fring) {
    fring.innerHTML =
      '<svg viewBox="0 0 140 140">' +
      '<circle class="fr-track" cx="70" cy="70" r="58" pathLength="100"/>' +
      '<circle class="fr-progress" cx="70" cy="70" r="58" pathLength="100"' +
      ' stroke-dasharray="100 100" transform="rotate(-90 70 70)"/>' +
      '<text class="fr-icon" x="70" y="64" text-anchor="middle">&#9981;</text>' +
      '<text class="fr-pct" x="70" y="94" text-anchor="middle">100%</text>' +
      "</svg>";
  }

  /* B2 — Tube: dikey depo, seviye çizgileri */
  var tube = $("#fuelTube");
  if (tube) {
    tube.innerHTML =
      '<div class="tb-tube"><div class="tb-fill"></div>' +
      '<div class="tb-marks"></div></div>' +
      '<div class="tb-label">&#9981; <span class="tb-pct">100%</span></div>';
  }

  /* B3 — Cells: 8 segment, azaldıkça söner */
  var cells = $("#fuelCells");
  if (cells) {
    var cl = "";
    for (var c1 = 0; c1 < 8; c1++) cl += '<div class="cl-cell"></div>';
    cells.innerHTML =
      '<span class="cl-icon">&#9981;</span>' +
      '<div class="cl-cells">' + cl + "</div>" +
      '<span class="cl-pct">100%</span>';
  }

  /* B4 — Quarter: köşeye oturan 90° yay */
  var quarter = $("#fuelQuarter");
  if (quarter) {
    var qD = arc(150, 150, 120, 180, 90);
    quarter.innerHTML =
      '<svg viewBox="0 0 160 160">' +
      '<path class="q-track" d="' + qD + '" pathLength="100"/>' +
      '<path class="q-progress" d="' + qD + '" pathLength="100" stroke-dasharray="100 100"/>' +
      '<text class="q-icon" x="92" y="92" text-anchor="middle">&#9981;</text>' +
      '<text class="q-pct" x="92" y="120" text-anchor="middle">100%</text>' +
      "</svg>";
  }

  /* B5 — Pill: mini kapsül bar */
  var fpill = $("#fuelPill");
  if (fpill) {
    fpill.innerHTML =
      '<span class="fp-icon">&#9981;</span>' +
      '<div class="fp-track"><div class="fp-fill"></div></div>' +
      '<span class="fp-pct">100%</span>';
  }

  /* ============================================================
     PACK C — RPM & GEAR
     ============================================================ */

  /* C1 — Tach: 270° mini takometre, kırmızı bölge, ortada vites */
  var tach = $("#rpmTach");
  if (tach) {
    var tD = arc(100, 100, 78, 135, 270);
    var tRed = arc(100, 100, 78, 135 + 270 * 0.8, 270 * 0.2);
    tach.innerHTML =
      '<svg viewBox="0 0 200 200">' +
      '<path class="tc-track" d="' + tD + '" pathLength="100"/>' +
      '<path class="tc-red" d="' + tRed + '"/>' +
      '<path class="tc-progress" d="' + tD + '" pathLength="100" stroke-dasharray="0 100"/>' +
      '<text class="tc-gear" x="100" y="112" text-anchor="middle">N</text>' +
      '<text class="tc-label" x="100" y="136" text-anchor="middle">GEAR</text>' +
      '<text class="tc-rpm" x="100" y="188" text-anchor="middle">RPM</text>' +
      "</svg>";
  }

  /* C2 — Shift Lights: 10 LED (4 cyan, 3 altın, 3 kırmızı), redline'da flaş */
  var shift = $("#rpmShift");
  if (shift) {
    var leds = "";
    for (var l1 = 0; l1 < 10; l1++) {
      leds += '<span class="sl-led ' +
              (l1 < 4 ? "c1" : l1 < 7 ? "c2" : "c3") + '"></span>';
    }
    shift.innerHTML =
      '<div class="sl-leds">' + leds + "</div>" +
      '<span class="sl-gear">N</span>';
  }

  /* C3 — Gear Ladder: vites çipleri + rpm mikro barı */
  var ladder = $("#rpmLadder");
  if (ladder) {
    var chips = "";
    ["R", "N", "1", "2", "3", "4", "5", "6"].forEach(function (g) {
      chips += '<span class="ld-chip" data-g="' + g + '">' + g + "</span>";
    });
    ladder.innerHTML =
      '<div class="ld-gears">' + chips + "</div>" +
      '<div class="ld-track"><div class="ld-fill"></div></div>';
  }

  /* C4 — Equalizer: yükselen 16 bar (son 4 kırmızı) */
  var eq = $("#rpmEq");
  if (eq) {
    var bars = "";
    for (var b1 = 0; b1 < 16; b1++) {
      bars += '<div class="eq-bar' + (b1 >= 12 ? " red" : "") +
              '" style="height:' + (8 + b1 * 1.9) + 'px"></div>';
    }
    eq.innerHTML =
      '<span class="eq-label">RPM</span>' +
      '<div class="eq-bars">' + bars + "</div>";
  }

  /* C5 — Core: rpm halkası içinde büyük vites */
  var core = $("#rpmCore");
  if (core) {
    core.innerHTML =
      '<svg viewBox="0 0 140 140">' +
      '<circle class="co-track" cx="70" cy="70" r="56" pathLength="100"/>' +
      '<circle class="co-progress" cx="70" cy="70" r="56" pathLength="100"' +
      ' stroke-dasharray="0 100" transform="rotate(-90 70 70)"/>' +
      '<text class="co-gear" x="70" y="86" text-anchor="middle">N</text>' +
      "</svg>";
  }

  /* ============================================================
     Güncelleme API'si
     ============================================================ */

  var HudV2 = {
    setSpeed: function (kmh) {
      kmh = clamp(Math.round(kmh), 0, MAX_SPEED);
      var pct = (kmh / MAX_SPEED) * 100;

      if (horizon) {
        $(".h-progress", horizon).setAttribute("stroke-dasharray", pct + " 100");
        $(".h-speed", horizon).textContent = kmh;
      }
      if (tower) {
        var tSlats = $$(".t-slat", tower);
        var onT = Math.round((pct / 100) * tSlats.length);
        tSlats.forEach(function (el, i) { el.classList.toggle("on", i < onT); });
        $(".t-speed", tower).textContent = kmh;
      }
      if (hex) {
        $(".hx-speed", hex).textContent = kmh;
        $(".hx-fill", hex).style.width = pct + "%";
      }
      if (blade) {
        $(".bl-speed", blade).textContent = kmh;
        $(".bl-fill", blade).style.width = pct + "%";
      }
      if (orbit) {
        var oDots = $$(".o-dot", orbit);
        var onO = Math.round((pct / 100) * oDots.length);
        oDots.forEach(function (el, i) { el.classList.toggle("on", i < onO); });
        $(".o-speed", orbit).textContent = kmh;
      }
    },

    setFuel: function (pct) {
      pct = clamp(pct, 0, 100);
      var low = pct < 20;
      var pctText = Math.round(pct) + "%";

      if (fring) {
        $(".fr-progress", fring).setAttribute("stroke-dasharray", pct + " 100");
        $(".fr-pct", fring).textContent = pctText;
        fring.classList.toggle("low", low);
      }
      if (tube) {
        $(".tb-fill", tube).style.height = pct + "%";
        $(".tb-pct", tube).textContent = pctText;
        tube.classList.toggle("low", low);
      }
      if (cells) {
        var cCells = $$(".cl-cell", cells);
        var onC = Math.ceil((pct / 100) * cCells.length);
        cCells.forEach(function (el, i) { el.classList.toggle("on", i < onC); });
        $(".cl-pct", cells).textContent = pctText;
        cells.classList.toggle("low", low);
      }
      if (quarter) {
        $(".q-progress", quarter).setAttribute("stroke-dasharray", pct + " 100");
        $(".q-pct", quarter).textContent = pctText;
        quarter.classList.toggle("low", low);
      }
      if (fpill) {
        $(".fp-fill", fpill).style.width = pct + "%";
        $(".fp-pct", fpill).textContent = pctText;
        fpill.classList.toggle("low", low);
      }
    },

    setRpm: function (rpm) {
      rpm = clamp(rpm, 0, 1);
      var pct = rpm * 100;

      if (tach) {
        $(".tc-progress", tach).setAttribute("stroke-dasharray", pct + " 100");
        tach.classList.toggle("hot", rpm > 0.8);
      }
      if (shift) {
        var sLeds = $$(".sl-led", shift);
        var onS = Math.round(rpm * sLeds.length);
        sLeds.forEach(function (el, i) { el.classList.toggle("on", i < onS); });
        shift.classList.toggle("flash", rpm > 0.95);
      }
      if (ladder) $(".ld-fill", ladder).style.width = pct + "%";
      if (eq) {
        var eBars = $$(".eq-bar", eq);
        var onE = Math.round(rpm * eBars.length);
        eBars.forEach(function (el, i) { el.classList.toggle("on", i < onE); });
      }
      if (core) {
        $(".co-progress", core).setAttribute("stroke-dasharray", pct + " 100");
        core.classList.toggle("hot", rpm > 0.85);
      }
    },

    setGear: function (gear) {
      var label = gear === 0 ? "R" : gear === -1 ? "N" : String(gear);
      if (tach) $(".tc-gear", tach).textContent = label;
      if (shift) $(".sl-gear", shift).textContent = label;
      if (core) $(".co-gear", core).textContent = label;
      if (ladder) {
        $$(".ld-chip", ladder).forEach(function (el) {
          el.classList.toggle("active", el.dataset.g === label);
        });
      }
    }
  };

  window.HudV2 = HudV2;

  /* ---------- FiveM NUI köprüsü ---------- */
  window.addEventListener("message", function (e) {
    var data = e.data;
    if (!data || data.type !== "carhud") return;
    if (typeof data.speed === "number") HudV2.setSpeed(data.speed);
    if (typeof data.rpm === "number") HudV2.setRpm(data.rpm);
    if (typeof data.gear === "number") HudV2.setGear(data.gear);
    if (typeof data.fuel === "number") HudV2.setFuel(data.fuel);
  });
})();
