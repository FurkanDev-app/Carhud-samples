/* ============================================================
   Aero Gallery — 15 uçak hız ölçer tasarımı
   Hepsi window.AeroHud.setSpeed(knot) ile beslenir;
   FiveM NUI mesajı (type: 'carhud', speed) otomatik dinlenir.
   Knot dönüşümü client tarafında: GetEntitySpeed(veh) * 1.94384
   ============================================================ */

(function () {
  "use strict";

  var MAX_JET = 400;   // knot — jet ölçekli göstergeler
  var MAX_GA = 240;    // knot — genel havacılık ölçekli göstergeler
  var MACH_1 = 661;    // knot ≈ deniz seviyesinde Mach 1

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

  /* ---------- A01 Steam ASI: klasik havacılık göstergesi ----------
     0 üstte, saat yönünde 330° tarama; renkli hız bantları:
     beyaz (flap) 40-100, yeşil 50-180, sarı 180-220, kırmızı çizgi 220 */

  var a01 = $("#a01");
  function asiDeg(v) { return -90 + (v / MAX_GA) * 330; }
  if (a01) {
    var t01 = "";
    for (var v1 = 0; v1 <= MAX_GA; v1 += 10) {
      var d1 = asiDeg(v1);
      var major1 = v1 % 20 === 0;
      var o1 = polar(110, 110, 96, d1), p1 = polar(110, 110, major1 ? 84 : 90, d1);
      t01 += '<line class="' + (major1 ? "" : "minor") + '" x1="' + o1.x + '" y1="' + o1.y +
             '" x2="' + p1.x + '" y2="' + p1.y + '"/>';
      if (v1 % 40 === 0) {
        var n1 = polar(110, 110, 70, d1);
        t01 += '<text x="' + n1.x + '" y="' + (n1.y + 5) + '" text-anchor="middle">' + v1 + "</text>";
      }
    }
    var bands =
      '<path class="asi-green" d="' + arc(110, 110, 96, asiDeg(50), asiDeg(180) - asiDeg(50)) + '"/>' +
      '<path class="asi-yellow" d="' + arc(110, 110, 96, asiDeg(180), asiDeg(220) - asiDeg(180)) + '"/>' +
      '<path class="asi-white" d="' + arc(110, 110, 88, asiDeg(40), asiDeg(100) - asiDeg(40)) + '"/>';
    var rl = polar(110, 110, 99, asiDeg(220)), rl2 = polar(110, 110, 82, asiDeg(220));
    a01.innerHTML =
      '<svg viewBox="0 0 220 220">' +
      '<circle class="asi-face" cx="110" cy="110" r="104"/>' +
      '<circle class="asi-bezel" cx="110" cy="110" r="104"/>' +
      bands +
      '<line class="asi-redline" x1="' + rl.x + '" y1="' + rl.y + '" x2="' + rl2.x + '" y2="' + rl2.y + '"/>' +
      '<g class="asi-ticks">' + t01 + "</g>" +
      '<text class="asi-label" x="110" y="76" text-anchor="middle">AIRSPEED</text>' +
      '<text class="asi-sub" x="110" y="156" text-anchor="middle">KNOTS</text>' +
      '<g class="asi-needle"><line x1="110" y1="110" x2="110" y2="26"/></g>' +
      '<circle class="asi-hub" cx="110" cy="110" r="8"/>' +
      "</svg>";
  }

  /* ---------- A02 PFD Tape: airliner glass cockpit şeridi ----------
     Gri kayan şerit, siyah okuma kutusu, yeşil/sarı/kırmızı bant,
     magenta hedef hız bug'ı (250 kt) */

  var a02 = $("#a02");
  var PFD_STEP = 14;
  function pfdY(v) { return ((MAX_JET - v) / 10) * PFD_STEP + 8; }
  if (a02) {
    var m02 = "";
    // renk bantları (şeritle beraber kayar)
    m02 += '<rect class="pfd-band g" x="82" y="' + pfdY(320) + '" width="4" height="' + (pfdY(120) - pfdY(320)) + '"/>';
    m02 += '<rect class="pfd-band y" x="82" y="' + pfdY(360) + '" width="4" height="' + (pfdY(320) - pfdY(360)) + '"/>';
    m02 += '<rect class="pfd-band r" x="82" y="' + pfdY(400) + '" width="4" height="' + (pfdY(360) - pfdY(400)) + '"/>';
    for (var v2 = 0; v2 <= MAX_JET; v2 += 10) {
      var y2 = pfdY(v2);
      var major2 = v2 % 20 === 0;
      m02 += '<line class="' + (major2 ? "" : "minor") + '" x1="' + (major2 ? 62 : 70) +
             '" y1="' + y2 + '" x2="80" y2="' + y2 + '"/>';
      if (v2 % 40 === 0) {
        m02 += '<text x="54" y="' + (y2 + 5) + '" text-anchor="end">' + v2 + "</text>";
      }
    }
    // magenta hız bug'ı @ 250 kt
    var by = pfdY(250);
    m02 += '<path class="pfd-bug" d="M 86 ' + (by - 7) + ' L 86 ' + (by + 7) +
           ' L 78 ' + by + " Z\"/>";
    var stripH2 = pfdY(0) + 8;
    a02.innerHTML =
      '<div class="pfd-window">' +
      '<svg class="pfd-strip" width="90" height="' + stripH2 + '">' + m02 + "</svg>" +
      '<div class="pfd-readout"><span class="pfd-speed">0</span></div>' +
      "</div>" +
      '<span class="pfd-title">IAS &bull; KT</span>';
  }

  /* ---------- A03 Combat HUD: yeşil fosfor savaş uçağı ---------- */

  var a03 = $("#a03");
  if (a03) {
    var lad = "";
    for (var l3 = 0; l3 < 9; l3++) {
      lad += '<div class="cb-tick' + (l3 % 2 === 0 ? " long" : "") + '"></div>';
    }
    a03.innerHTML =
      '<div class="cb-panel">' +
      '<div class="cb-left">' +
      '<span class="cb-label">SPD&nbsp;KT</span>' +
      '<div class="cb-box">[&nbsp;<span class="cb-speed">000</span>&nbsp;]</div>' +
      '<span class="cb-mach">M&nbsp;<span class="cb-machval">0.00</span></span>' +
      "</div>" +
      '<div class="cb-ladder">' + lad + '<div class="cb-caret">&#9664;</div></div>' +
      '<div class="cb-scan"></div>' +
      "</div>";
  }

  /* ---------- A04 Mach Meter: 240° ibreli kadran + dijital pencere ---------- */

  var a04 = $("#a04");
  if (a04) {
    var t04 = "";
    for (var m4 = 0; m4 <= 10; m4++) {
      var d4 = 150 + (m4 / 10) * 240;
      var o4 = polar(100, 100, 82, d4), p4 = polar(100, 100, m4 % 2 === 0 ? 70 : 76, d4);
      t04 += '<line class="' + (m4 % 2 ? "minor" : "") + '" x1="' + o4.x + '" y1="' + o4.y +
             '" x2="' + p4.x + '" y2="' + p4.y + '"/>';
      if (m4 % 2 === 0) {
        var n4 = polar(100, 100, 58, d4);
        t04 += '<text x="' + n4.x + '" y="' + (n4.y + 4) + '" text-anchor="middle">' +
               (m4 / 10).toFixed(1).replace("0.", ".") + "</text>";
      }
    }
    var redzone4 = arc(100, 100, 82, 150 + 240 * 0.9, 240 * 0.1);
    a04.innerHTML =
      '<svg viewBox="0 0 200 200">' +
      '<circle class="mm-face" cx="100" cy="100" r="94"/>' +
      '<circle class="mm-bezel" cx="100" cy="100" r="94"/>' +
      '<path class="mm-red" d="' + redzone4 + '"/>' +
      '<g class="mm-ticks">' + t04 + "</g>" +
      '<text class="mm-label" x="100" y="72" text-anchor="middle">MACH</text>' +
      '<rect class="mm-win" x="72" y="118" width="56" height="22" rx="4"/>' +
      '<text class="mm-digital" x="100" y="134" text-anchor="middle">M 0.00</text>' +
      '<g class="mm-needle"><line x1="100" y1="100" x2="176" y2="100"/></g>' +
      '<circle class="mm-hub" cx="100" cy="100" r="7"/>' +
      "</svg>";
  }

  /* ---------- A05 Warbird: fildişi kadran, MPH, 2. dünya savaşı ---------- */

  var a05 = $("#a05");
  function wbDeg(v) { return -90 + (v / MAX_GA) * 330; }
  if (a05) {
    var t05 = "";
    for (var v5 = 0; v5 <= MAX_GA; v5 += 10) {
      var d5 = wbDeg(v5);
      var major5 = v5 % 20 === 0;
      var o5 = polar(105, 105, 88, d5), p5 = polar(105, 105, major5 ? 76 : 82, d5);
      t05 += '<line class="' + (major5 ? "" : "minor") + '" x1="' + o5.x + '" y1="' + o5.y +
             '" x2="' + p5.x + '" y2="' + p5.y + '"/>';
      if (v5 % 40 === 0) {
        var n5 = polar(105, 105, 62, d5);
        t05 += '<text x="' + n5.x + '" y="' + (n5.y + 5) + '" text-anchor="middle">' + v5 + "</text>";
      }
    }
    a05.innerHTML =
      '<svg viewBox="0 0 210 210">' +
      '<defs><radialGradient id="wbFace" cx="50%" cy="42%" r="70%">' +
      '<stop offset="0%" stop-color="#f8f0dd"/>' +
      '<stop offset="100%" stop-color="#e2d4b2"/></radialGradient></defs>' +
      '<circle class="wb-bezel" cx="105" cy="105" r="100"/>' +
      '<circle cx="105" cy="105" r="93" fill="url(#wbFace)"/>' +
      '<g class="wb-ticks">' + t05 + "</g>" +
      '<text class="wb-brand" x="105" y="78" text-anchor="middle">AIR SPEED</text>' +
      '<text class="wb-unit" x="105" y="146" text-anchor="middle">M.P.H.</text>' +
      '<g class="wb-needle"><line x1="105" y1="105" x2="105" y2="30"/>' +
      '<line class="tail" x1="105" y1="105" x2="105" y2="122"/></g>' +
      '<circle class="wb-hub" cx="105" cy="105" r="8"/>' +
      "</svg>";
  }

  /* ---------- A06 V-Bug Arc: V hızı işaretli modern yay ---------- */

  var a06 = $("#a06");
  var VSPEEDS = [
    { v: 55, label: "VR" }, { v: 85, label: "VFE" },
    { v: 160, label: "VNO" }, { v: 210, label: "VNE" }
  ];
  if (a06) {
    var d06 = arc(100, 100, 80, 135, 270);
    var bugs6 = "";
    VSPEEDS.forEach(function (vs) {
      var dg = 135 + (vs.v / MAX_GA) * 270;
      var o6 = polar(100, 100, 92, dg), p6 = polar(100, 100, 70, dg);
      var n6 = polar(100, 100, 102, dg);
      bugs6 += '<line class="vb-bug' + (vs.label === "VNE" ? " red" : "") +
               '" x1="' + o6.x + '" y1="' + o6.y + '" x2="' + p6.x + '" y2="' + p6.y + '"/>' +
               '<text class="vb-buglabel" x="' + n6.x + '" y="' + (n6.y + 3) +
               '" text-anchor="middle">' + vs.label + "</text>";
    });
    a06.innerHTML =
      '<svg viewBox="-16 -16 232 232">' +
      '<path class="vb-track" d="' + d06 + '" pathLength="100"/>' +
      '<path class="vb-progress" d="' + d06 + '" pathLength="100" stroke-dasharray="0 100"/>' +
      bugs6 +
      '<text class="vb-speed" x="100" y="108" text-anchor="middle">0</text>' +
      '<text class="vb-unit" x="100" y="128" text-anchor="middle">KTS</text>' +
      "</svg>";
  }

  /* ---------- A07 Glass Compact: mini EFIS, trend oklu ---------- */

  var a07 = $("#a07");
  if (a07) {
    a07.innerHTML =
      '<div class="ef-panel">' +
      '<div class="ef-main">' +
      '<span class="ef-speed">0</span>' +
      '<div class="ef-side"><span class="ef-trend">&#9644;</span>' +
      '<span class="ef-unit">KTS</span></div>' +
      "</div>" +
      '<div class="ef-band"><div class="ef-caret"></div></div>' +
      "</div>";
  }

  /* ---------- A08 Panoramic: 5. nesil geniş kokpit paneli ---------- */

  var a08 = $("#a08");
  if (a08) {
    a08.innerHTML =
      '<div class="pn-panel">' +
      '<div class="pn-line"><div class="pn-fill"></div></div>' +
      '<div class="pn-row">' +
      '<span class="pn-label">IAS</span>' +
      '<span class="pn-speed">0</span>' +
      '<div class="pn-right"><span class="pn-unit">KT</span>' +
      '<span class="pn-mach">M 0.00</span></div>' +
      "</div></div>";
  }

  /* ---------- A09 Mach Strip: süpersonik yatay şerit ---------- */

  var a09 = $("#a09");
  if (a09) {
    a09.innerHTML =
      '<div class="ms-head"><span class="ms-title">MACH</span>' +
      '<span class="ms-val">0.00</span></div>' +
      '<div class="ms-strip">' +
      '<div class="ms-zone z1"></div><div class="ms-zone z2"></div>' +
      '<div class="ms-zone z3"></div><div class="ms-zone z4"></div>' +
      '<div class="ms-marker"></div>' +
      "</div>" +
      '<div class="ms-scale"><span>0</span><span>.25</span><span>.50</span><span>.75</span><span>1.0</span></div>';
  }

  /* ---------- A10 Rotor: helikopter, hızla dönen pervane ---------- */

  var a10 = $("#a10");
  var rotorAngle = 0;
  if (a10) {
    var d10 = arc(100, 100, 84, 135, 270);
    a10.innerHTML =
      '<svg viewBox="0 0 200 200">' +
      '<path class="rt-track" d="' + d10 + '" pathLength="100"/>' +
      '<path class="rt-progress" d="' + d10 + '" pathLength="100" stroke-dasharray="0 100"/>' +
      '<g class="rt-rotor">' +
      '<ellipse cx="100" cy="70" rx="6" ry="32"/>' +
      '<ellipse cx="100" cy="70" rx="6" ry="32" transform="rotate(120 100 100)"/>' +
      '<ellipse cx="100" cy="70" rx="6" ry="32" transform="rotate(240 100 100)"/>' +
      "</g>" +
      '<circle class="rt-hub" cx="100" cy="100" r="9"/>' +
      '<text class="rt-speed" x="100" y="168" text-anchor="middle">0</text>' +
      '<text class="rt-unit" x="100" y="186" text-anchor="middle">KTS</text>' +
      "</svg>";
  }

  /* ---------- A11 Holo Ring: hologram halka ---------- */

  var a11 = $("#a11");
  if (a11) {
    a11.innerHTML =
      '<div class="hl-wrap">' +
      '<svg class="hl-spin" viewBox="0 0 180 180">' +
      '<circle cx="90" cy="90" r="82" fill="none" stroke-dasharray="6 10"/>' +
      "</svg>" +
      '<svg class="hl-gauge" viewBox="0 0 180 180">' +
      '<circle class="hl-track" cx="90" cy="90" r="66" pathLength="100"/>' +
      '<circle class="hl-progress" cx="90" cy="90" r="66" pathLength="100"' +
      ' stroke-dasharray="0 100" transform="rotate(-90 90 90)"/>' +
      "</svg>" +
      '<div class="hl-readout"><span class="hl-speed">0</span>' +
      '<span class="hl-unit">IAS &bull; KTS</span></div>' +
      "</div>";
  }

  /* ---------- A12 Ground Tape: yatay HUD şeridi ---------- */

  var a12 = $("#a12");
  var GT_STEP = 14;
  function gtX(v) { return (v / 10) * GT_STEP + 8; }
  if (a12) {
    var m12 = "";
    for (var v12 = 0; v12 <= MAX_JET; v12 += 10) {
      var x12 = gtX(v12);
      var major12 = v12 % 20 === 0;
      m12 += '<line class="' + (major12 ? "" : "minor") + '" x1="' + x12 +
             '" y1="' + (major12 ? 26 : 32) + '" x2="' + x12 + '" y2="44"/>';
      if (v12 % 40 === 0) {
        m12 += '<text x="' + x12 + '" y="18" text-anchor="middle">' + v12 + "</text>";
      }
    }
    var stripW12 = gtX(MAX_JET) + 8;
    a12.innerHTML =
      '<div class="gt-readout"><span class="gt-speed">0</span><span class="gt-unit">KT</span></div>' +
      '<div class="gt-window">' +
      '<svg class="gt-strip" width="' + stripW12 + '" height="48">' + m12 + "</svg>" +
      '<div class="gt-caret"></div>' +
      "</div>";
  }

  /* ---------- A13 IAS / TAS: çift okuma paneli ---------- */

  var a13 = $("#a13");
  if (a13) {
    a13.innerHTML =
      '<div class="duo-col"><span class="duo-label">IAS</span>' +
      '<span class="duo-ias">0</span><span class="duo-unit">KTS</span></div>' +
      '<div class="duo-div"></div>' +
      '<div class="duo-col"><span class="duo-label">TAS</span>' +
      '<span class="duo-tas">0</span><span class="duo-unit">KTS</span></div>';
  }

  /* ---------- A14 Afterburner: art yakıcı barı ---------- */

  var a14 = $("#a14");
  if (a14) {
    a14.innerHTML =
      '<div class="ab-row">' +
      '<span class="ab-speed">0</span><span class="ab-unit">KT</span>' +
      '<span class="ab-badge">AB</span>' +
      "</div>" +
      '<div class="ab-bar"><div class="ab-fill"></div></div>' +
      '<div class="ab-scale"><span>MIL</span><span>AB</span></div>';
  }

  /* ---------- A15 Standby: monokrom yedek gösterge ---------- */

  var a15 = $("#a15");
  function sbDeg(v) { return -90 + (v / MAX_JET) * 300; }
  if (a15) {
    var t15 = "";
    for (var v15 = 0; v15 <= MAX_JET; v15 += 20) {
      var d15 = sbDeg(v15);
      var major15 = v15 % 40 === 0;
      var o15 = polar(100, 100, 88, d15), p15 = polar(100, 100, major15 ? 76 : 82, d15);
      t15 += '<line class="' + (major15 ? "" : "minor") + '" x1="' + o15.x + '" y1="' + o15.y +
             '" x2="' + p15.x + '" y2="' + p15.y + '"/>';
      if (v15 % 80 === 0) {
        var n15 = polar(100, 100, 62, d15);
        t15 += '<text x="' + n15.x + '" y="' + (n15.y + 4) + '" text-anchor="middle">' + v15 + "</text>";
      }
    }
    a15.innerHTML =
      '<svg viewBox="0 0 200 200">' +
      '<circle class="sb-face" cx="100" cy="100" r="94"/>' +
      '<circle class="sb-bezel" cx="100" cy="100" r="94"/>' +
      '<g class="sb-ticks">' + t15 + "</g>" +
      '<text class="sb-label" x="100" y="140" text-anchor="middle">IAS</text>' +
      '<rect class="sb-win" x="76" y="150" width="48" height="18" rx="3"/>' +
      '<text class="sb-speed" x="100" y="163" text-anchor="middle">0</text>' +
      '<g class="sb-needle"><line x1="100" y1="100" x2="100" y2="22"/></g>' +
      '<circle class="sb-hub" cx="100" cy="100" r="6"/>' +
      "</svg>";
  }

  /* ============================================================
     Güncelleme API'si
     ============================================================ */

  var prevKts = 0;

  function setSpeed(kts) {
    kts = clamp(Math.round(kts), 0, 2000);
    var trend = kts - prevKts;
    prevKts = kts;

    var ga = clamp(kts, 0, MAX_GA);
    var jet = clamp(kts, 0, MAX_JET);
    var jetPct = (jet / MAX_JET) * 100;
    var mach = clamp(kts / MACH_1, 0, 1);

    if (a01) {
      $(".asi-needle", a01).style.transform = "rotate(" + (ga / MAX_GA) * 330 + "deg)";
    }

    if (a02) {
      var t2 = 90 - pfdY(jet);
      $(".pfd-strip", a02).style.transform = "translateY(" + t2 + "px)";
      $(".pfd-speed", a02).textContent = jet;
    }

    if (a03) {
      var s3 = String(jet);
      while (s3.length < 3) s3 = "0" + s3;
      $(".cb-speed", a03).textContent = s3;
      $(".cb-machval", a03).textContent = mach.toFixed(2);
      $(".cb-caret", a03).style.top = (100 - jetPct) + "%";
    }

    if (a04) {
      $(".mm-needle", a04).style.transform = "rotate(" + mach * 240 + "deg)";
      $(".mm-digital", a04).textContent = "M " + mach.toFixed(2);
    }

    if (a05) {
      var mph = clamp(kts * 1.15078, 0, MAX_GA);
      $(".wb-needle", a05).style.transform = "rotate(" + (mph / MAX_GA) * 330 + "deg)";
    }

    if (a06) {
      $(".vb-progress", a06).setAttribute("stroke-dasharray", (ga / MAX_GA) * 100 + " 100");
      $(".vb-speed", a06).textContent = ga;
    }

    if (a07) {
      $(".ef-speed", a07).textContent = jet;
      $(".ef-caret", a07).style.bottom = jetPct + "%";
      var tEl = $(".ef-trend", a07);
      if (trend > 1) { tEl.innerHTML = "&#9650;"; tEl.className = "ef-trend up"; }
      else if (trend < -1) { tEl.innerHTML = "&#9660;"; tEl.className = "ef-trend down"; }
      else { tEl.innerHTML = "&#9644;"; tEl.className = "ef-trend"; }
    }

    if (a08) {
      $(".pn-speed", a08).textContent = jet;
      $(".pn-fill", a08).style.width = jetPct + "%";
      $(".pn-mach", a08).textContent = "M " + mach.toFixed(2);
    }

    if (a09) {
      $(".ms-val", a09).textContent = mach.toFixed(2);
      $(".ms-marker", a09).style.left = mach * 100 + "%";
    }

    if (a10) {
      rotorAngle = (rotorAngle + jet * 0.12) % 360;
      $(".rt-rotor", a10).style.transform = "rotate(" + rotorAngle + "deg)";
      $(".rt-progress", a10).setAttribute("stroke-dasharray", jetPct + " 100");
      $(".rt-speed", a10).textContent = jet;
    }

    if (a11) {
      $(".hl-progress", a11).setAttribute("stroke-dasharray", jetPct + " 100");
      $(".hl-speed", a11).textContent = jet;
    }

    if (a12) {
      $(".gt-strip", a12).style.transform = "translateX(" + (120 - gtX(jet)) + "px)";
      $(".gt-speed", a12).textContent = jet;
    }

    if (a13) {
      $(".duo-ias", a13).textContent = jet;
      $(".duo-tas", a13).textContent = Math.round(jet * 1.15);
    }

    if (a14) {
      $(".ab-speed", a14).textContent = jet;
      $(".ab-fill", a14).style.width = jetPct + "%";
      a14.classList.toggle("lit", jetPct > 80);
    }

    if (a15) {
      $(".sb-needle", a15).style.transform = "rotate(" + (jet / MAX_JET) * 300 + "deg)";
      $(".sb-speed", a15).textContent = jet;
    }
  }

  window.AeroHud = { setSpeed: setSpeed };

  /* ---------- FiveM NUI köprüsü ---------- */
  window.addEventListener("message", function (e) {
    var data = e.data;
    if (!data || data.type !== "carhud" || typeof data.speed !== "number") return;
    setSpeed(data.speed);
  });
})();
