/* ============================================================
   Cockpit Gallery — 15 uçak göstergesi (tam set)
   window.FlightHud.set({...}) ile beslenir; FiveM NUI mesajı
   (type: 'carhud') otomatik dinlenir. Alanlar:
     alt   → irtifa (ft)          vs   → dikey hız (ft/min)
     pitch → yunuslama (°)        roll → yatış (°)
     hdg   → istikamet (°)        slip → kayma (-1..1)
     aoa   → hücum açısı (°)      g    → g kuvveti
     n1    → motor devri (%)      egt  → egzoz sıcaklığı (°C)
     fuelL/fuelR → tank (kg)      oilP/oilT → yağ (psi/°C)
     flaps → flap (°)             gear → 'up'|'down'|'transit'
     thr   → gaz kolu (%)         ra   → yerden yükseklik (ft)
   ============================================================ */

(function () {
  "use strict";

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

  /* ---------- F01 Altimeter: çift ibre + dijital pencere ---------- */

  var f01 = $("#f01");
  if (f01) {
    var t01 = "";
    for (var n1t = 0; n1t < 10; n1t++) {
      var d01 = -90 + n1t * 36;
      var o01 = polar(100, 100, 88, d01), p01 = polar(100, 100, 78, d01);
      t01 += '<line x1="' + o01.x + '" y1="' + o01.y + '" x2="' + p01.x + '" y2="' + p01.y + '"/>';
      var tx01 = polar(100, 100, 64, d01);
      t01 += '<text x="' + tx01.x + '" y="' + (tx01.y + 5) + '" text-anchor="middle">' + n1t + "</text>";
      // ara tick'ler
      for (var h1 = 1; h1 < 5; h1++) {
        var dh = d01 + h1 * 7.2;
        var oh = polar(100, 100, 88, dh), ph = polar(100, 100, 83, dh);
        t01 += '<line class="minor" x1="' + oh.x + '" y1="' + oh.y + '" x2="' + ph.x + '" y2="' + ph.y + '"/>';
      }
    }
    f01.innerHTML =
      '<svg viewBox="0 0 200 200">' +
      '<circle class="ins-face" cx="100" cy="100" r="94"/>' +
      '<circle class="ins-bezel" cx="100" cy="100" r="94"/>' +
      '<g class="ins-ticks">' + t01 + "</g>" +
      '<text class="ins-label" x="100" y="52" text-anchor="middle">ALT</text>' +
      '<text class="alt-kolls" x="152" y="104" text-anchor="middle">29.92</text>' +
      '<rect class="ins-win" x="66" y="120" width="68" height="18" rx="3"/>' +
      '<text class="alt-digital" x="100" y="133" text-anchor="middle">0 FT</text>' +
      '<g class="alt-n1k"><polygon points="100,54 95,102 105,102"/></g>' +
      '<g class="alt-n100"><line x1="100" y1="108" x2="100" y2="22"/></g>' +
      '<circle class="ins-hub" cx="100" cy="100" r="7"/>' +
      "</svg>";
  }

  /* ---------- F02 Attitude Indicator: suni ufuk ---------- */

  var f02 = $("#f02");
  if (f02) {
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
    f02.innerHTML =
      '<div class="adi-scope">' +
      '<div class="adi-ball">' + ladder + "</div>" +
      '<div class="adi-fixed">' +
      '<span class="adi-wing lw"></span><span class="adi-dot"></span><span class="adi-wing rw"></span>' +
      "</div>" +
      '<div class="adi-pointer"></div>' +
      "</div>";
  }

  /* ---------- F03 Heading Indicator: dönen pusula gülü ---------- */

  var f03 = $("#f03");
  if (f03) {
    var rose = "";
    var CARD = { 0: "N", 90: "E", 180: "S", 270: "W" };
    for (var hd = 0; hd < 360; hd += 5) {
      var dd = -90 + hd;
      var major3 = hd % 10 === 0;
      var o3 = polar(100, 100, 88, dd), p3 = polar(100, 100, major3 ? 79 : 83, dd);
      rose += '<line class="' + (major3 ? "" : "minor") + '" x1="' + o3.x + '" y1="' + o3.y +
              '" x2="' + p3.x + '" y2="' + p3.y + '"/>';
      if (hd % 30 === 0) {
        var lbl = CARD[hd] !== undefined ? CARD[hd] : String(hd / 10);
        var tp3 = polar(100, 100, 66, dd);
        rose += '<text class="' + (CARD[hd] ? "card" : "") + '" x="' + tp3.x + '" y="' + tp3.y +
                '" text-anchor="middle" transform="rotate(' + hd + " " + tp3.x + " " + tp3.y +
                ')" dy="4">' + lbl + "</text>";
      }
    }
    f03.innerHTML =
      '<svg viewBox="0 0 200 200">' +
      '<circle class="ins-face" cx="100" cy="100" r="94"/>' +
      '<circle class="ins-bezel" cx="100" cy="100" r="94"/>' +
      '<g class="hdg-rose">' + rose + "</g>" +
      '<polygon class="hdg-lubber" points="100,10 94,24 106,24"/>' +
      '<path class="hdg-plane" d="M100 86 L100 118 M84 102 L116 102 M92 114 L108 114"/>' +
      '<rect class="ins-win" x="72" y="132" width="56" height="18" rx="3"/>' +
      '<text class="hdg-digital" x="100" y="145" text-anchor="middle">000&deg;</text>' +
      "</svg>";
  }

  /* ---------- F04 VSI: varyometre ---------- */

  var f04 = $("#f04");
  if (f04) {
    var t04 = "";
    for (var v4 = -20; v4 <= 20; v4 += 5) {
      var d4 = 180 + (v4 / 20) * 160;
      var major4 = v4 % 10 === 0;
      var o4 = polar(100, 100, 86, d4), p4 = polar(100, 100, major4 ? 76 : 81, d4);
      t04 += '<line class="' + (major4 ? "" : "minor") + '" x1="' + o4.x + '" y1="' + o4.y +
             '" x2="' + p4.x + '" y2="' + p4.y + '"/>';
      if (major4) {
        var n4 = polar(100, 100, 64, d4);
        t04 += '<text x="' + n4.x + '" y="' + (n4.y + 4) + '" text-anchor="middle">' + Math.abs(v4) + "</text>";
      }
    }
    f04.innerHTML =
      '<svg viewBox="0 0 200 200">' +
      '<circle class="ins-face" cx="100" cy="100" r="94"/>' +
      '<circle class="ins-bezel" cx="100" cy="100" r="94"/>' +
      '<g class="ins-ticks">' + t04 + "</g>" +
      '<text class="ins-label" x="100" y="56" text-anchor="middle">VERTICAL SPEED</text>' +
      '<text class="vsi-sub" x="100" y="150" text-anchor="middle">100 FT/MIN</text>' +
      '<text class="vsi-updn" x="52" y="72" text-anchor="middle">UP</text>' +
      '<text class="vsi-updn" x="52" y="136" text-anchor="middle">DN</text>' +
      '<g class="vsi-needle"><line x1="100" y1="100" x2="20" y2="100"/></g>' +
      '<circle class="ins-hub" cx="100" cy="100" r="7"/>' +
      "</svg>";
  }

  /* ---------- F05 Turn Coordinator ---------- */

  var f05 = $("#f05");
  if (f05) {
    f05.innerHTML =
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

  /* ---------- F06 AOA Indexer ---------- */

  var f06 = $("#f06");
  if (f06) {
    f06.innerHTML =
      '<div class="aoa-panel">' +
      '<svg class="aoa-lights" viewBox="0 0 60 130">' +
      '<path class="aoa-hi" d="M14 34 L30 14 L46 34" fill="none"/>' +
      '<circle class="aoa-ok" cx="30" cy="65" r="13" fill="none"/>' +
      '<path class="aoa-lo" d="M14 96 L30 116 L46 96" fill="none"/>' +
      "</svg>" +
      '<div class="aoa-read"><span class="aoa-label">AOA</span>' +
      '<span class="aoa-val">0.0&deg;</span></div>' +
      "</div>";
  }

  /* ---------- F07 G-Meter ---------- */

  var f07 = $("#f07");
  if (f07) {
    var t07 = "";
    for (var g7 = -2; g7 <= 8; g7++) {
      var d7 = 135 + ((g7 + 2) / 10) * 270;
      var major7 = g7 % 2 === 0;
      var o7 = polar(100, 100, 86, d7), p7 = polar(100, 100, major7 ? 76 : 81, d7);
      t07 += '<line class="' + (major7 ? "" : "minor") + '" x1="' + o7.x + '" y1="' + o7.y +
             '" x2="' + p7.x + '" y2="' + p7.y + '"/>';
      if (major7) {
        var n7 = polar(100, 100, 64, d7);
        t07 += '<text x="' + n7.x + '" y="' + (n7.y + 4) + '" text-anchor="middle">' + g7 + "</text>";
      }
    }
    f07.innerHTML =
      '<svg viewBox="0 0 200 200">' +
      '<circle class="ins-face" cx="100" cy="100" r="94"/>' +
      '<circle class="ins-bezel" cx="100" cy="100" r="94"/>' +
      '<g class="ins-ticks">' + t07 + "</g>" +
      '<text class="ins-label" x="100" y="60" text-anchor="middle">ACCEL &bull; G</text>' +
      '<g class="g-max"><line x1="176" y1="100" x2="188" y2="100"/></g>' +
      '<g class="g-needle"><line x1="100" y1="100" x2="178" y2="100"/></g>' +
      '<circle class="ins-hub" cx="100" cy="100" r="7"/>' +
      '<rect class="ins-win" x="66" y="126" width="68" height="18" rx="3"/>' +
      '<text class="g-digital" x="100" y="139" text-anchor="middle">+1.0 G</text>' +
      "</svg>";
  }

  /* ---------- F08 N1 Gauge ---------- */

  var f08 = $("#f08");
  if (f08) {
    var t08 = "";
    for (var p8 = 0; p8 <= 110; p8 += 10) {
      var d8 = 135 + (p8 / 110) * 270;
      var o8 = polar(100, 100, 86, d8), q8 = polar(100, 100, 77, d8);
      t08 += '<line x1="' + o8.x + '" y1="' + o8.y + '" x2="' + q8.x + '" y2="' + q8.y + '"/>';
      if (p8 % 20 === 0) {
        var n8 = polar(100, 100, 64, d8);
        t08 += '<text x="' + n8.x + '" y="' + (n8.y + 4) + '" text-anchor="middle">' + p8 + "</text>";
      }
    }
    var red8 = arc(100, 100, 86, 135 + (100 / 110) * 270, (10 / 110) * 270);
    f08.innerHTML =
      '<svg viewBox="0 0 200 200">' +
      '<circle class="ins-face" cx="100" cy="100" r="94"/>' +
      '<circle class="ins-bezel" cx="100" cy="100" r="94"/>' +
      '<path class="n1-red" d="' + red8 + '"/>' +
      '<g class="ins-ticks">' + t08 + "</g>" +
      '<text class="ins-label" x="100" y="60" text-anchor="middle">N1 %</text>' +
      '<g class="n1-needle"><line x1="100" y1="100" x2="178" y2="100"/></g>' +
      '<circle class="ins-hub" cx="100" cy="100" r="7"/>' +
      '<rect class="ins-win" x="66" y="126" width="68" height="18" rx="3"/>' +
      '<text class="n1-digital" x="100" y="139" text-anchor="middle">0.0</text>' +
      "</svg>";
  }

  /* ---------- F09 EGT ---------- */

  var f09 = $("#f09");
  if (f09) {
    f09.innerHTML =
      '<div class="egt-panel">' +
      '<div class="egt-head"><span class="egt-title">EGT</span>' +
      '<span class="egt-val">0&deg;C</span></div>' +
      '<div class="egt-bar">' +
      '<div class="egt-zone zg"></div><div class="egt-zone zy"></div><div class="egt-zone zr"></div>' +
      '<div class="egt-marker"></div>' +
      "</div>" +
      '<div class="egt-scale"><span>0</span><span>300</span><span>600</span><span>900</span></div>' +
      "</div>";
  }

  /* ---------- F10 Fuel Qty ---------- */

  var f10 = $("#f10");
  if (f10) {
    f10.innerHTML =
      '<div class="fu-panel">' +
      '<div class="fu-tank"><span class="fu-tag">L</span>' +
      '<div class="fu-tube"><div class="fu-fill fl"></div></div>' +
      '<span class="fu-val vl">0</span></div>' +
      '<div class="fu-mid"><span class="fu-title">FUEL</span><span class="fu-unit">KG</span></div>' +
      '<div class="fu-tank"><span class="fu-tag">R</span>' +
      '<div class="fu-tube"><div class="fu-fill fr"></div></div>' +
      '<span class="fu-val vr">0</span></div>' +
      "</div>";
  }

  /* ---------- F11 Oil ---------- */

  var f11 = $("#f11");
  if (f11) {
    f11.innerHTML =
      '<div class="oil-panel">' +
      '<div class="oil-row"><span class="oil-label">OIL PRESS</span>' +
      '<div class="oil-bar"><div class="oil-green" style="left:33%;width:42%"></div>' +
      '<div class="oil-caret cp"></div></div>' +
      '<span class="oil-val vp">0</span><span class="oil-unit">PSI</span></div>' +
      '<div class="oil-row"><span class="oil-label">OIL TEMP</span>' +
      '<div class="oil-bar"><div class="oil-green" style="left:40%;width:33%"></div>' +
      '<div class="oil-caret ct"></div></div>' +
      '<span class="oil-val vt">0</span><span class="oil-unit">&deg;C</span></div>' +
      "</div>";
  }

  /* ---------- F12 Flaps ---------- */

  var f12 = $("#f12");
  var FLAP_DETENTS = [0, 10, 20, 35];
  if (f12) {
    f12.innerHTML =
      '<div class="flp-panel">' +
      '<div class="flp-detents">' +
      '<span data-f="0">UP</span><span data-f="10">1</span>' +
      '<span data-f="20">2</span><span data-f="35">FULL</span>' +
      "</div>" +
      '<div class="flp-track"><div class="flp-marker"></div></div>' +
      '<div class="flp-read"><span class="flp-title">FLAPS</span>' +
      '<span class="flp-val">0&deg;</span></div>' +
      "</div>";
  }

  /* ---------- F13 Landing Gear ---------- */

  var f13 = $("#f13");
  if (f13) {
    f13.innerHTML =
      '<div class="gr-panel">' +
      '<span class="gr-title">GEAR</span>' +
      '<div class="gr-tri">' +
      '<div class="gr-light nose"></div>' +
      '<div class="gr-row"><div class="gr-light left"></div><div class="gr-light right"></div></div>' +
      "</div>" +
      '<span class="gr-status">UP</span>' +
      "</div>";
  }

  /* ---------- F14 Throttle ---------- */

  var f14 = $("#f14");
  if (f14) {
    f14.innerHTML =
      '<div class="th-panel">' +
      '<div class="th-track">' +
      '<div class="th-ab-zone"></div>' +
      '<div class="th-knob"></div>' +
      "</div>" +
      '<div class="th-labels"><span>AB</span><span>MIL</span><span>IDLE</span></div>' +
      '<div class="th-read"><span class="th-title">THR</span>' +
      '<span class="th-val">0%</span></div>' +
      "</div>";
  }

  /* ---------- F15 Radar Altimeter ---------- */

  var f15 = $("#f15");
  var RA_MAX = 2500, DH = 200;
  if (f15) {
    var t15 = "";
    for (var r15 = 0; r15 <= RA_MAX; r15 += 250) {
      var d15 = 135 + (r15 / RA_MAX) * 270;
      var major15 = r15 % 500 === 0;
      var o15 = polar(100, 100, 86, d15), p15 = polar(100, 100, major15 ? 77 : 81, d15);
      t15 += '<line class="' + (major15 ? "" : "minor") + '" x1="' + o15.x + '" y1="' + o15.y +
             '" x2="' + p15.x + '" y2="' + p15.y + '"/>';
      if (major15 && r15 % 1000 === 0) {
        var n15 = polar(100, 100, 63, d15);
        t15 += '<text x="' + n15.x + '" y="' + (n15.y + 4) + '" text-anchor="middle">' + (r15 / 100) + "</text>";
      }
    }
    var dhDeg = 135 + (DH / RA_MAX) * 270;
    var dh1 = polar(100, 100, 92, dhDeg), dh2 = polar(100, 100, 72, dhDeg);
    f15.innerHTML =
      '<svg viewBox="0 0 200 200">' +
      '<circle class="ins-face" cx="100" cy="100" r="94"/>' +
      '<circle class="ins-bezel" cx="100" cy="100" r="94"/>' +
      '<g class="ins-ticks">' + t15 + "</g>" +
      '<line class="ra-dh" x1="' + dh1.x + '" y1="' + dh1.y + '" x2="' + dh2.x + '" y2="' + dh2.y + '"/>' +
      '<text class="ins-label" x="100" y="58" text-anchor="middle">RAD ALT &times;100</text>' +
      '<g class="ra-needle"><line x1="100" y1="100" x2="178" y2="100"/></g>' +
      '<circle class="ins-hub" cx="100" cy="100" r="7"/>' +
      '<rect class="ins-win" x="62" y="124" width="76" height="18" rx="3"/>' +
      '<text class="ra-digital" x="100" y="137" text-anchor="middle">0 FT</text>' +
      '<text class="ra-badge" x="100" y="162" text-anchor="middle">DH</text>' +
      "</svg>";
  }

  /* ============================================================
     Güncelleme API'si
     ============================================================ */

  var gMax = 1;

  function set(d) {
    if (f01 && typeof d.alt === "number") {
      var alt = Math.max(0, d.alt);
      $(".alt-n100", f01).style.transform = "rotate(" + ((alt % 1000) / 1000) * 360 + "deg)";
      $(".alt-n1k", f01).style.transform = "rotate(" + ((alt % 10000) / 10000) * 360 + "deg)";
      $(".alt-digital", f01).textContent = Math.round(alt) + " FT";
    }

    if (f02 && typeof d.pitch === "number" && typeof d.roll === "number") {
      $(".adi-ball", f02).style.transform =
        "translate(-50%, -50%) rotate(" + clamp(-d.roll, -60, 60) + "deg) translateY(" +
        clamp(d.pitch, -25, 25) * 2.2 + "px)";
    }

    if (f03 && typeof d.hdg === "number") {
      var hdg = ((d.hdg % 360) + 360) % 360;
      $(".hdg-rose", f03).style.transform = "rotate(" + -hdg + "deg)";
      var hs = String(Math.round(hdg));
      while (hs.length < 3) hs = "0" + hs;
      $(".hdg-digital", f03).textContent = hs + "°";
    }

    if (f04 && typeof d.vs === "number") {
      var vsC = clamp(d.vs, -2000, 2000);
      $(".vsi-needle", f04).style.transform = "rotate(" + (vsC / 2000) * 160 + "deg)";
    }

    if (f05) {
      if (typeof d.roll === "number") {
        $(".tc-plane", f05).style.transform = "rotate(" + clamp(d.roll, -32, 32) + "deg)";
      }
      if (typeof d.slip === "number") {
        $(".tc-ball", f05).setAttribute("cx", 100 + clamp(d.slip, -1, 1) * 26);
      }
    }

    if (f06 && typeof d.aoa === "number") {
      $(".aoa-hi", f06).classList.toggle("lit", d.aoa > 11);
      $(".aoa-ok", f06).classList.toggle("lit", d.aoa >= 7.5 && d.aoa <= 11);
      $(".aoa-lo", f06).classList.toggle("lit", d.aoa < 7.5);
      $(".aoa-val", f06).textContent = d.aoa.toFixed(1) + "°";
    }

    if (f07 && typeof d.g === "number") {
      var gC = clamp(d.g, -2, 8);
      gMax = Math.max(gMax, gC);
      $(".g-needle", f07).style.transform = "rotate(" + (135 + ((gC + 2) / 10) * 270) + "deg)";
      $(".g-max", f07).style.transform = "rotate(" + (135 + ((gMax + 2) / 10) * 270) + "deg)";
      $(".g-digital", f07).textContent = (gC >= 0 ? "+" : "") + gC.toFixed(1) + " G";
    }

    if (f08 && typeof d.n1 === "number") {
      var n1C = clamp(d.n1, 0, 110);
      $(".n1-needle", f08).style.transform = "rotate(" + (135 + (n1C / 110) * 270) + "deg)";
      $(".n1-digital", f08).textContent = n1C.toFixed(1);
      f08.classList.toggle("hot", n1C > 100);
    }

    if (f09 && typeof d.egt === "number") {
      var egtC = clamp(d.egt, 0, 900);
      $(".egt-marker", f09).style.left = (egtC / 900) * 100 + "%";
      $(".egt-val", f09).textContent = Math.round(egtC) + "°C";
      f09.classList.toggle("hot", egtC > 800);
    }

    if (f10) {
      var CAP = 3000;
      if (typeof d.fuelL === "number") {
        var pl = clamp(d.fuelL / CAP, 0, 1);
        $(".fu-fill.fl", f10).style.height = pl * 100 + "%";
        $(".fu-val.vl", f10).textContent = Math.round(d.fuelL);
        $(".fu-fill.fl", f10).classList.toggle("low", pl < 0.15);
      }
      if (typeof d.fuelR === "number") {
        var pr = clamp(d.fuelR / CAP, 0, 1);
        $(".fu-fill.fr", f10).style.height = pr * 100 + "%";
        $(".fu-val.vr", f10).textContent = Math.round(d.fuelR);
        $(".fu-fill.fr", f10).classList.toggle("low", pr < 0.15);
      }
    }

    if (f11) {
      if (typeof d.oilP === "number") {
        $(".oil-caret.cp", f11).style.left = clamp(d.oilP / 120, 0, 1) * 100 + "%";
        $(".oil-val.vp", f11).textContent = Math.round(d.oilP);
      }
      if (typeof d.oilT === "number") {
        $(".oil-caret.ct", f11).style.left = clamp(d.oilT / 150, 0, 1) * 100 + "%";
        $(".oil-val.vt", f11).textContent = Math.round(d.oilT);
      }
    }

    if (f12 && typeof d.flaps === "number") {
      var fC = clamp(d.flaps, 0, 35);
      $(".flp-marker", f12).style.top = (fC / 35) * 100 + "%";
      $(".flp-val", f12).textContent = Math.round(fC) + "°";
      var nearest = FLAP_DETENTS.reduce(function (a, b) {
        return Math.abs(b - fC) < Math.abs(a - fC) ? b : a;
      });
      $$(".flp-detents span", f12).forEach(function (el) {
        el.classList.toggle("active", Number(el.dataset.f) === nearest);
      });
    }

    if (f13 && typeof d.gear === "string") {
      var lights = $$(".gr-light", f13);
      lights.forEach(function (el) {
        el.classList.remove("down", "transit");
        if (d.gear === "down") el.classList.add("down");
        if (d.gear === "transit") el.classList.add("transit");
      });
      $(".gr-status", f13).textContent = d.gear.toUpperCase();
      $(".gr-status", f13).className = "gr-status " + d.gear;
    }

    if (f14 && typeof d.thr === "number") {
      var thrC = clamp(d.thr, 0, 100);
      $(".th-knob", f14).style.bottom = thrC + "%";
      $(".th-val", f14).textContent = Math.round(thrC) + "%";
      f14.classList.toggle("ab", thrC > 88);
    }

    if (f15 && typeof d.ra === "number") {
      var raC = clamp(d.ra, 0, RA_MAX);
      $(".ra-needle", f15).style.transform = "rotate(" + (135 + (raC / RA_MAX) * 270) + "deg)";
      $(".ra-digital", f15).textContent = Math.round(raC) + " FT";
      f15.classList.toggle("dh", raC < DH);
    }
  }

  window.FlightHud = { set: set };

  /* ---------- FiveM NUI köprüsü ---------- */
  window.addEventListener("message", function (e) {
    var data = e.data;
    if (!data || data.type !== "carhud") return;
    set(data);
  });
})();
