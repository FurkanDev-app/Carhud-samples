/* ============================================================
   Selected Widgets — seçilen 7 tasarım, bağımsız paket
     Araç : Classic Gauge, Horizon, Dash Arc, Wings (km/h)
     Uçak : Altimeter, Attitude, Turn Coordinator
   window.SelectedHud.set({ speed, alt, pitch, roll, slip })
   FiveM NUI mesajı (type: 'carhud') otomatik dinlenir.
   ============================================================ */

(function () {
  "use strict";

  var MAX_SPEED = 240; // km/h

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
           (Math.abs(sweep) > 180 ? 1 : 0) + " 1 " + e.x + " " + e.y;
  }

  /* ============ Classic Gauge (ice tema) ============ */

  var selClassic = $("#selClassic");
  var GC_START = 135, GC_SWEEP = 270;
  if (selClassic) {
    selClassic.classList.add("gauge-classic");
    var svgNS = "http://www.w3.org/2000/svg";
    var d = arc(150, 150, 118, GC_START, GC_SWEEP);
    var ticks = "";
    var step = MAX_SPEED / 24;
    for (var v = 0; v <= MAX_SPEED; v += step) {
      var deg = GC_START + (v / MAX_SPEED) * GC_SWEEP;
      var major = Math.round(v / step) % 2 === 0;
      var o = polar(150, 150, 108, deg);
      var i = polar(150, 150, major ? 98 : 102, deg);
      ticks += '<line class="' + (major ? "cg-tick" : "cg-tick minor") + '" x1="' + o.x +
               '" y1="' + o.y + '" x2="' + i.x + '" y2="' + i.y + '"/>';
      if (Math.round(v / step) % 4 === 0) {
        var tp = polar(150, 150, 84, deg);
        ticks += '<text class="cg-num" x="' + tp.x + '" y="' + (tp.y + 5) +
                 '" text-anchor="middle">' + Math.round(v) + "</text>";
      }
    }
    selClassic.innerHTML =
      '<svg viewBox="0 0 300 300">' +
      '<defs><radialGradient id="cgFace" cx="50%" cy="42%" r="70%">' +
      '<stop class="cg-face-hi" offset="0%"/><stop class="cg-face-mid" offset="70%"/>' +
      '<stop class="cg-face-lo" offset="100%"/></radialGradient></defs>' +
      '<circle cx="150" cy="150" r="142" fill="url(#cgFace)"/>' +
      '<circle class="cg-bezel" cx="150" cy="150" r="136" fill="none"/>' +
      '<circle class="cg-inner" cx="150" cy="150" r="128" fill="none"/>' +
      '<path class="cg-track" d="' + d + '" fill="none" pathLength="100"/>' +
      '<path class="cg-progress" d="' + d + '" fill="none" pathLength="100" stroke-dasharray="0 100"/>' +
      '<g class="cg-ticks">' + ticks + "</g>" +
      '<g class="cg-needle"><line class="cg-needle-main" x1="150" y1="150" x2="258" y2="150"/>' +
      '<line class="cg-needle-tail" x1="150" y1="150" x2="128" y2="150"/></g>' +
      '<circle class="cg-hub" cx="150" cy="150" r="9"/>' +
      '<circle class="cg-hub-core" cx="150" cy="150" r="4"/>' +
      '<text class="cg-speed" x="150" y="205" text-anchor="middle">0</text>' +
      '<text class="cg-unit" x="150" y="226" text-anchor="middle">KM/H</text>' +
      "</svg>";
  }

  /* ============ A1 Horizon: 180° yarım yay ============ */

  var selHorizon = $("#selHorizon");
  if (selHorizon) {
    var hTicks = "";
    for (var vh = 0; vh <= MAX_SPEED; vh += 20) {
      var dh = 180 + (vh / MAX_SPEED) * 180;
      var oh = polar(150, 145, 106, dh);
      var ih = polar(150, 145, vh % 40 === 0 ? 96 : 100, dh);
      hTicks += '<line class="' + (vh % 40 ? "minor" : "") + '" x1="' + oh.x +
                '" y1="' + oh.y + '" x2="' + ih.x + '" y2="' + ih.y + '"/>';
      if (vh % 120 === 0) {
        var th = polar(150, 145, 80, dh);
        hTicks += '<text x="' + th.x + '" y="' + (th.y + 4) +
                  '" text-anchor="middle">' + vh + "</text>";
      }
    }
    var hD = arc(150, 145, 118, 180, 180);
    selHorizon.innerHTML =
      '<svg viewBox="0 0 300 165">' +
      '<path class="h-track" d="' + hD + '" pathLength="100"/>' +
      '<path class="h-progress" d="' + hD + '" pathLength="100" stroke-dasharray="0 100"/>' +
      '<g class="h-ticks">' + hTicks + "</g>" +
      '<text class="h-speed" x="150" y="120" text-anchor="middle">0</text>' +
      '<text class="h-unit" x="150" y="142" text-anchor="middle">KM/H</text>' +
      "</svg>";
  }

  /* ============ S01 Dash Arc: 28 segmentli yay ============ */

  var selDash = $("#selDash");
  if (selDash) {
    var segs = "", N_SEG = 28;
    for (var i1 = 0; i1 < N_SEG; i1++) {
      var d1 = 135 + (i1 / (N_SEG - 1)) * 270;
      var o1 = polar(100, 100, 88, d1), p1 = polar(100, 100, 72, d1);
      var cls1 = i1 < 18 ? "c-cyan" : i1 < 24 ? "c-gold" : "c-red";
      segs += '<line class="da-seg ' + cls1 + '" x1="' + o1.x + '" y1="' + o1.y +
              '" x2="' + p1.x + '" y2="' + p1.y + '"/>';
    }
    selDash.innerHTML =
      '<svg viewBox="0 0 200 200">' + segs +
      '<text class="da-speed" x="100" y="110" text-anchor="middle">0</text>' +
      '<text class="da-unit" x="100" y="132" text-anchor="middle">KM/H</text>' +
      "</svg>";
  }

  /* ============ S02 Wings: simetrik çift yan yay ============ */

  var selWings = $("#selWings");
  if (selWings) {
    var wl = arc(100, 100, 84, 135, 90);
    var wr = arc(100, 100, 84, 315, 90);
    selWings.innerHTML =
      '<svg viewBox="0 0 200 200">' +
      '<path class="wg-track" d="' + wl + '" pathLength="100"/>' +
      '<path class="wg-track" d="' + wr + '" pathLength="100"/>' +
      '<path class="wg-progress" d="' + wl + '" pathLength="100" stroke-dasharray="0 100"/>' +
      '<path class="wg-progress" d="' + wr + '" pathLength="100" stroke-dasharray="0 100"/>' +
      '<text class="wg-speed" x="100" y="112" text-anchor="middle">0</text>' +
      '<text class="wg-unit" x="100" y="134" text-anchor="middle">KM/H</text>' +
      "</svg>";
  }

  /* ============ F01 Altimeter ============ */

  var selAlt = $("#selAlt");
  if (selAlt) {
    var tAlt = "";
    for (var nA = 0; nA < 10; nA++) {
      var dA = -90 + nA * 36;
      var oA = polar(100, 100, 88, dA), pA = polar(100, 100, 78, dA);
      tAlt += '<line x1="' + oA.x + '" y1="' + oA.y + '" x2="' + pA.x + '" y2="' + pA.y + '"/>';
      var txA = polar(100, 100, 64, dA);
      tAlt += '<text x="' + txA.x + '" y="' + (txA.y + 5) + '" text-anchor="middle">' + nA + "</text>";
      for (var hA = 1; hA < 5; hA++) {
        var dhA = dA + hA * 7.2;
        var ohA = polar(100, 100, 88, dhA), phA = polar(100, 100, 83, dhA);
        tAlt += '<line class="minor" x1="' + ohA.x + '" y1="' + ohA.y +
                '" x2="' + phA.x + '" y2="' + phA.y + '"/>';
      }
    }
    selAlt.innerHTML =
      '<svg viewBox="0 0 200 200">' +
      '<circle class="ins-face" cx="100" cy="100" r="94"/>' +
      '<circle class="ins-bezel" cx="100" cy="100" r="94"/>' +
      '<g class="ins-ticks">' + tAlt + "</g>" +
      '<text class="ins-label" x="100" y="52" text-anchor="middle">ALT</text>' +
      '<text class="alt-kolls" x="152" y="104" text-anchor="middle">29.92</text>' +
      '<rect class="ins-win" x="66" y="120" width="68" height="18" rx="3"/>' +
      '<text class="alt-digital" x="100" y="133" text-anchor="middle">0 FT</text>' +
      '<g class="alt-n1k"><polygon points="100,54 95,102 105,102"/></g>' +
      '<g class="alt-n100"><line x1="100" y1="108" x2="100" y2="22"/></g>' +
      '<circle class="ins-hub" cx="100" cy="100" r="7"/>' +
      "</svg>";
  }

  /* ============ F02 Attitude Indicator ============ */

  var selAdi = $("#selAdi");
  if (selAdi) {
    var ladder = "";
    [10, 20].forEach(function (p) {
      [-1, 1].forEach(function (s) {
        var off = s * p * 2.2;
        var w = p === 10 ? 56 : 76;
        ladder += '<div class="adi-lad" style="top:calc(50% - ' + off + 'px);width:' + w + 'px"></div>' +
          '<span class="adi-ladnum" style="top:calc(50% - ' + (off + 7) + 'px);left:calc(50% - ' + (w / 2 + 20) + 'px)">' + p + "</span>" +
          '<span class="adi-ladnum" style="top:calc(50% - ' + (off + 7) + 'px);left:calc(50% + ' + (w / 2 + 6) + 'px)">' + p + "</span>";
      });
    });
    selAdi.innerHTML =
      '<div class="adi-scope">' +
      '<div class="adi-ball">' + ladder + "</div>" +
      '<div class="adi-fixed">' +
      '<span class="adi-wing lw"></span><span class="adi-dot"></span><span class="adi-wing rw"></span>' +
      "</div>" +
      '<div class="adi-pointer"></div>' +
      "</div>";
  }

  /* ============ F05 Turn Coordinator ============ */

  var selTc = $("#selTc");
  if (selTc) {
    selTc.innerHTML =
      '<svg viewBox="0 0 200 200">' +
      '<circle class="ins-face" cx="100" cy="100" r="94"/>' +
      '<circle class="ins-bezel" cx="100" cy="100" r="94"/>' +
      '<line class="tc-mark" x1="14" y1="100" x2="30" y2="100"/>' +
      '<line class="tc-mark" x1="170" y1="100" x2="186" y2="100"/>' +
      '<line class="tc-mark" x1="24" y1="72" x2="38" y2="79"/>' +
      '<line class="tc-mark" x1="162" y1="79" x2="176" y2="72"/>' +
      '<text class="tc-lr" x="30" y="62" text-anchor="middle">L</text>' +
      '<text class="tc-lr" x="170" y="62" text-anchor="middle">R</text>' +
      '<g class="tc-plane">' +
      '<line x1="34" y1="100" x2="166" y2="100"/>' +
      '<line x1="100" y1="100" x2="100" y2="82"/>' +
      '<line x1="88" y1="88" x2="112" y2="88"/>' +
      "</g>" +
      '<circle class="ins-hub" cx="100" cy="100" r="6"/>' +
      '<rect class="tc-tube" x="58" y="148" width="84" height="17" rx="8"/>' +
      '<line class="tc-ref" x1="94" y1="148" x2="94" y2="165"/>' +
      '<line class="tc-ref" x1="106" y1="148" x2="106" y2="165"/>' +
      '<circle class="tc-ball" cx="100" cy="156.5" r="6"/>' +
      '<text class="ins-label" x="100" y="182" text-anchor="middle">TURN COORD</text>' +
      "</svg>";
  }

  /* ============================================================
     Güncelleme API'si
     ============================================================ */

  function set(d) {
    if (typeof d.speed === "number") {
      var kmh = clamp(Math.round(d.speed), 0, MAX_SPEED);
      var pct = (kmh / MAX_SPEED) * 100;

      if (selClassic) {
        $(".cg-progress", selClassic).setAttribute("stroke-dasharray", pct + " 100");
        $(".cg-needle", selClassic).style.transform =
          "rotate(" + (GC_START + (kmh / MAX_SPEED) * GC_SWEEP) + "deg)";
        $(".cg-speed", selClassic).textContent = kmh;
      }
      if (selHorizon) {
        $(".h-progress", selHorizon).setAttribute("stroke-dasharray", pct + " 100");
        $(".h-speed", selHorizon).textContent = kmh;
      }
      if (selDash) {
        var daSegs = $$(".da-seg", selDash);
        var onDa = Math.round((pct / 100) * daSegs.length);
        daSegs.forEach(function (el, i) { el.classList.toggle("on", i < onDa); });
        $(".da-speed", selDash).textContent = kmh;
      }
      if (selWings) {
        $$(".wg-progress", selWings).forEach(function (el) {
          el.setAttribute("stroke-dasharray", pct + " 100");
        });
        $(".wg-speed", selWings).textContent = kmh;
      }
    }

    if (selAlt && typeof d.alt === "number") {
      var alt = Math.max(0, d.alt);
      $(".alt-n100", selAlt).style.transform = "rotate(" + ((alt % 1000) / 1000) * 360 + "deg)";
      $(".alt-n1k", selAlt).style.transform = "rotate(" + ((alt % 10000) / 10000) * 360 + "deg)";
      $(".alt-digital", selAlt).textContent = Math.round(alt) + " FT";
    }

    if (selAdi && typeof d.pitch === "number" && typeof d.roll === "number") {
      $(".adi-ball", selAdi).style.transform =
        "translate(-50%, -50%) rotate(" + clamp(-d.roll, -60, 60) + "deg) translateY(" +
        clamp(d.pitch, -25, 25) * 2.2 + "px)";
    }

    if (selTc) {
      if (typeof d.roll === "number") {
        $(".tc-plane", selTc).style.transform = "rotate(" + clamp(d.roll, -32, 32) + "deg)";
      }
      if (typeof d.slip === "number") {
        $(".tc-ball", selTc).setAttribute("cx", 100 + clamp(d.slip, -1, 1) * 26);
      }
    }
  }

  window.SelectedHud = { set: set };

  /* ---------- FiveM NUI köprüsü ---------- */
  window.addEventListener("message", function (e) {
    var data = e.data;
    if (!data || data.type !== "carhud") return;
    set(data);
  });
})();
