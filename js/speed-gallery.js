/* ============================================================
   Speed Gallery — 15 hız göstergesi tasarımı
   Hepsi window.SpeedHud.setSpeed(kmh) ile beslenir;
   FiveM NUI mesajı (type: 'carhud', speed) otomatik dinlenir.
   ============================================================ */

(function () {
  "use strict";

  var MAX = 240;

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

  /* ---------- S01 Dash Arc: 28 segmentli 270° yay ---------- */

  var s01 = $("#s01");
  if (s01) {
    var segs = "", N01 = 28;
    for (var i1 = 0; i1 < N01; i1++) {
      var deg1 = 135 + (i1 / (N01 - 1)) * 270;
      var o1 = polar(100, 100, 88, deg1), p1 = polar(100, 100, 72, deg1);
      var cls1 = i1 < 18 ? "c-cyan" : i1 < 24 ? "c-gold" : "c-red";
      segs += '<line class="da-seg ' + cls1 + '" x1="' + o1.x + '" y1="' + o1.y +
              '" x2="' + p1.x + '" y2="' + p1.y + '"/>';
    }
    s01.innerHTML =
      '<svg viewBox="0 0 200 200">' + segs +
      '<text class="da-speed" x="100" y="110" text-anchor="middle">0</text>' +
      '<text class="da-unit" x="100" y="132" text-anchor="middle">KM/H</text>' +
      "</svg>";
  }

  /* ---------- S02 Wings: simetrik çift yan yay ---------- */

  var s02 = $("#s02");
  if (s02) {
    var wl = arc(100, 100, 84, 135, 90);   // sol kanat 135°→225°
    var wr = arc(100, 100, 84, 315, 90);   // sağ kanat 315°→45°
    s02.innerHTML =
      '<svg viewBox="0 0 200 200">' +
      '<path class="wg-track" d="' + wl + '" pathLength="100"/>' +
      '<path class="wg-track" d="' + wr + '" pathLength="100"/>' +
      '<path class="wg-progress" d="' + wl + '" pathLength="100" stroke-dasharray="0 100"/>' +
      '<path class="wg-progress" d="' + wr + '" pathLength="100" stroke-dasharray="0 100"/>' +
      '<text class="wg-speed" x="100" y="112" text-anchor="middle">0</text>' +
      '<text class="wg-unit" x="100" y="134" text-anchor="middle">KM/H</text>' +
      "</svg>";
  }

  /* ---------- S03 Minimal: sade dijital + ince çizgi ---------- */

  var s03 = $("#s03");
  if (s03) {
    s03.innerHTML =
      '<div class="mn-row"><span class="mn-speed">0</span>' +
      '<span class="mn-unit">KM/H</span></div>' +
      '<div class="mn-track"><div class="mn-fill"></div></div>';
  }

  /* ---------- S04 Squircle: yuvarlak kare çevre progress ---------- */

  var s04 = $("#s04");
  if (s04) {
    s04.innerHTML =
      '<svg viewBox="0 0 160 160">' +
      '<rect class="sq-track" x="8" y="8" width="144" height="144" rx="30" pathLength="100"/>' +
      '<rect class="sq-progress" x="8" y="8" width="144" height="144" rx="30"' +
      ' pathLength="100" stroke-dasharray="0 100"/>' +
      '<text class="sq-speed" x="80" y="88" text-anchor="middle">0</text>' +
      '<text class="sq-unit" x="80" y="110" text-anchor="middle">KM/H</text>' +
      "</svg>";
  }

  /* ---------- S05 Retro LCD: 7 segment hayaleti ile amber panel ---------- */

  var s05 = $("#s05");
  if (s05) {
    s05.innerHTML =
      '<div class="lc-panel">' +
      '<span class="lc-ghost">888</span>' +
      '<span class="lc-speed">0</span>' +
      '</div><span class="lc-unit">KM/H</span>';
  }

  /* ---------- S06 Aero Tape: havacılık tipi kayan şerit ---------- */

  var s06 = $("#s06");
  var TAPE_STEP = 16; // 10 km/h başına piksel
  if (s06) {
    var marks = "";
    for (var v6 = 0; v6 <= MAX; v6 += 10) {
      var y6 = ((MAX - v6) / 10) * TAPE_STEP + 8;
      var major6 = v6 % 20 === 0;
      marks += '<line class="' + (major6 ? "" : "minor") + '" x1="' +
               (major6 ? 52 : 60) + '" y1="' + y6 + '" x2="72" y2="' + y6 + '"/>';
      if (major6) {
        marks += '<text x="44" y="' + (y6 + 4) + '" text-anchor="end">' + v6 + "</text>";
      }
    }
    var stripH = (MAX / 10) * TAPE_STEP + 16;
    s06.innerHTML =
      '<div class="tp-window">' +
      '<svg class="tp-strip" width="80" height="' + stripH + '">' + marks + "</svg>" +
      '<div class="tp-readout"><span class="tp-speed">0</span></div>' +
      "</div>" +
      '<span class="tp-unit">KM/H</span>';
  }

  /* ---------- S07 Radar: conic süpürme izi + iğne ---------- */

  var s07 = $("#s07");
  if (s07) {
    s07.innerHTML =
      '<div class="rd-scope">' +
      '<div class="rd-trail"></div>' +
      '<div class="rd-grid"></div><div class="rd-grid g2"></div>' +
      '<div class="rd-needle"></div>' +
      '<div class="rd-center"><span class="rd-speed">0</span>' +
      '<span class="rd-unit">KM/H</span></div>' +
      "</div>";
  }

  /* ---------- S08 Chevron Rush: hızla yanan ok dizisi ---------- */

  var s08 = $("#s08");
  if (s08) {
    var chevs = "";
    for (var c8 = 0; c8 < 8; c8++) {
      var cls8 = c8 < 5 ? "c-cyan" : c8 < 7 ? "c-gold" : "c-red";
      chevs += '<span class="ch-arrow ' + cls8 + '"></span>';
    }
    s08.innerHTML =
      '<div class="ch-readout"><span class="ch-speed">0</span>' +
      '<span class="ch-unit">KM/H</span></div>' +
      '<div class="ch-arrows">' + chevs + "</div>";
  }

  /* ---------- S09 Neon Tunnel: içten dışa dolan 3 halka ---------- */

  var s09 = $("#s09");
  if (s09) {
    var rings = "";
    var radii = [84, 66, 48];
    for (var r9 = 0; r9 < 3; r9++) {
      var d9 = arc(100, 100, radii[r9], 135, 270);
      rings += '<path class="tn-track" d="' + d9 + '" pathLength="100"/>' +
               '<path class="tn-progress tn-r' + r9 + '" d="' + d9 +
               '" pathLength="100" stroke-dasharray="0 100"/>';
    }
    s09.innerHTML =
      '<svg viewBox="0 0 200 200">' + rings +
      '<text class="tn-speed" x="100" y="108" text-anchor="middle">0</text>' +
      '<text class="tn-unit" x="100" y="128" text-anchor="middle">KM/H</text>' +
      "</svg>";
  }

  /* ---------- S10 Liquid Orb: sıvı dolumlu cam küre ---------- */

  var s10 = $("#s10");
  if (s10) {
    s10.innerHTML =
      '<div class="lo-orb">' +
      '<div class="lo-fill"></div>' +
      '<div class="lo-shine"></div>' +
      '<div class="lo-readout"><span class="lo-speed">0</span>' +
      '<span class="lo-unit">KM/H</span></div>' +
      "</div>";
  }

  /* ---------- S11 Crystal: elmas panel ---------- */

  var s11 = $("#s11");
  if (s11) {
    s11.innerHTML =
      '<div class="cr-outer"><div class="cr-inner">' +
      '<div class="cr-content"><span class="cr-speed">0</span>' +
      '<span class="cr-unit">KM/H</span>' +
      '<div class="cr-track"><div class="cr-fill"></div></div></div>' +
      "</div></div>";
  }

  /* ---------- S12 Glitch: cyberpunk köşe çerçevesi ---------- */

  var s12 = $("#s12");
  if (s12) {
    var dashes = "";
    for (var d12 = 0; d12 < 12; d12++) dashes += '<span class="gl-dash"></span>';
    s12.innerHTML =
      '<div class="gl-frame">' +
      '<span class="gl-c tl"></span><span class="gl-c tr"></span>' +
      '<span class="gl-c bl"></span><span class="gl-c br"></span>' +
      '<span class="gl-speed">0</span><span class="gl-unit">KM/H</span>' +
      '<div class="gl-dashes">' + dashes + "</div>" +
      "</div>";
  }

  /* ---------- S13 Slider: dolum barını izleyen baloncuk ---------- */

  var s13 = $("#s13");
  if (s13) {
    s13.innerHTML =
      '<div class="sd-bubble"><span class="sd-speed">0</span></div>' +
      '<div class="sd-bar"><div class="sd-fill"></div></div>' +
      '<div class="sd-scale"><span>0</span><span>120</span><span>240</span></div>';
  }

  /* ---------- S14 Vintage: fildişi kadranlı yarım analog ---------- */

  var s14 = $("#s14");
  if (s14) {
    var vTicks = "";
    for (var v14 = 0; v14 <= MAX; v14 += 10) {
      var deg14 = 180 + (v14 / MAX) * 180;
      var major14 = v14 % 40 === 0;
      var o14 = polar(100, 105, 84, deg14);
      var i14 = polar(100, 105, major14 ? 72 : 78, deg14);
      vTicks += '<line class="' + (major14 ? "" : "minor") + '" x1="' + o14.x +
                '" y1="' + o14.y + '" x2="' + i14.x + '" y2="' + i14.y + '"/>';
      if (major14) {
        var t14 = polar(100, 105, 60, deg14);
        vTicks += '<text x="' + t14.x + '" y="' + (t14.y + 4) +
                  '" text-anchor="middle">' + v14 + "</text>";
      }
    }
    s14.innerHTML =
      '<svg viewBox="0 0 200 120">' +
      '<defs><linearGradient id="vinFace" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0%" stop-color="#f8f0dd"/>' +
      '<stop offset="100%" stop-color="#e8dcc0"/></linearGradient></defs>' +
      '<path class="vn-face" d="M 10 105 A 90 90 0 0 1 190 105 Z" fill="url(#vinFace)"/>' +
      '<path class="vn-bezel" d="M 10 105 A 90 90 0 0 1 190 105" fill="none"/>' +
      '<g class="vn-ticks">' + vTicks + "</g>" +
      '<text class="vn-brand" x="100" y="58" text-anchor="middle">km/h</text>' +
      '<g class="vn-needle"><line x1="100" y1="105" x2="34" y2="105"/></g>' +
      '<circle class="vn-hub" cx="100" cy="105" r="7"/>' +
      '<rect class="vn-win" x="80" y="84" width="40" height="17" rx="3"/>' +
      '<text class="vn-speed" x="100" y="97" text-anchor="middle">0</text>' +
      "</svg>";
  }

  /* ---------- S15 Comet: halkada dolaşan kuyruklu nokta ---------- */

  var s15 = $("#s15");
  if (s15) {
    var cD = arc(100, 100, 82, 135, 270);
    s15.innerHTML =
      '<svg viewBox="0 0 200 200">' +
      '<path class="cm-track" d="' + cD + '" pathLength="100"/>' +
      '<path class="cm-tail-dim" d="' + cD + '" pathLength="100" stroke-dasharray="0 100"/>' +
      '<path class="cm-tail" d="' + cD + '" pathLength="100" stroke-dasharray="0 100"/>' +
      '<circle class="cm-head" cx="0" cy="0" r="6"/>' +
      '<text class="cm-speed" x="100" y="108" text-anchor="middle">0</text>' +
      '<text class="cm-unit" x="100" y="130" text-anchor="middle">KM/H</text>' +
      "</svg>";
    // başlangıç konumu
    var h0 = polar(100, 100, 82, 135);
    var cmHead = $(".cm-head", s15);
    cmHead.setAttribute("cx", h0.x);
    cmHead.setAttribute("cy", h0.y);
  }

  /* ============================================================
     Güncelleme API'si
     ============================================================ */

  function setSpeed(kmh) {
    kmh = clamp(Math.round(kmh), 0, MAX);
    var pct = (kmh / MAX) * 100;

    if (s01) {
      var daSegs = $$(".da-seg", s01);
      var onDa = Math.round((pct / 100) * daSegs.length);
      daSegs.forEach(function (el, i) { el.classList.toggle("on", i < onDa); });
      $(".da-speed", s01).textContent = kmh;
    }

    if (s02) {
      $$(".wg-progress", s02).forEach(function (el) {
        el.setAttribute("stroke-dasharray", pct + " 100");
      });
      $(".wg-speed", s02).textContent = kmh;
    }

    if (s03) {
      $(".mn-speed", s03).textContent = kmh;
      $(".mn-fill", s03).style.width = pct + "%";
    }

    if (s04) {
      $(".sq-progress", s04).setAttribute("stroke-dasharray", pct + " 100");
      $(".sq-speed", s04).textContent = kmh;
    }

    if (s05) $(".lc-speed", s05).textContent = kmh;

    if (s06) {
      var t6 = 85 - (8 + ((MAX - kmh) / 10) * TAPE_STEP);
      $(".tp-strip", s06).style.transform = "translateY(" + t6 + "px)";
      $(".tp-speed", s06).textContent = kmh;
    }

    if (s07) {
      var sweep7 = (pct / 100) * 270;
      $(".rd-trail", s07).style.background =
        "conic-gradient(from 225deg, rgba(94,203,255,.5) 0deg, rgba(94,203,255,.06) " +
        sweep7 + "deg, transparent " + sweep7 + "deg 360deg)";
      $(".rd-needle", s07).style.transform =
        "translateX(-50%) rotate(" + (225 + sweep7) + "deg)";
      $(".rd-speed", s07).textContent = kmh;
    }

    if (s08) {
      var arrows = $$(".ch-arrow", s08);
      var onCh = Math.round((pct / 100) * arrows.length);
      arrows.forEach(function (el, i) { el.classList.toggle("on", i < onCh); });
      $(".ch-speed", s08).textContent = kmh;
    }

    if (s09) {
      var seg9 = (pct / 100) * 3;
      for (var r9b = 0; r9b < 3; r9b++) {
        var fill9 = clamp(seg9 - r9b, 0, 1) * 100;
        $(".tn-r" + r9b, s09).setAttribute("stroke-dasharray", fill9 + " 100");
      }
      $(".tn-speed", s09).textContent = kmh;
    }

    if (s10) {
      $(".lo-fill", s10).style.height = pct + "%";
      $(".lo-speed", s10).textContent = kmh;
    }

    if (s11) {
      $(".cr-speed", s11).textContent = kmh;
      $(".cr-fill", s11).style.width = pct + "%";
    }

    if (s12) {
      $(".gl-speed", s12).textContent = kmh;
      var glDashes = $$(".gl-dash", s12);
      var onGl = Math.round((pct / 100) * glDashes.length);
      glDashes.forEach(function (el, i) { el.classList.toggle("on", i < onGl); });
    }

    if (s13) {
      $(".sd-fill", s13).style.width = pct + "%";
      var bubble = $(".sd-bubble", s13);
      bubble.style.left = pct + "%";
      bubble.style.transform = "translateX(-" + pct + "%)";
      $(".sd-speed", s13).textContent = kmh;
    }

    if (s14) {
      $(".vn-needle", s14).style.transform = "rotate(" + (pct / 100) * 180 + "deg)";
      $(".vn-speed", s14).textContent = kmh;
    }

    if (s15) {
      var TAIL = 12, TAIL_DIM = 24;
      var tail = clamp(pct, 0, TAIL);
      var tailDim = clamp(pct, 0, TAIL_DIM);
      var tEl = $(".cm-tail", s15);
      tEl.setAttribute("stroke-dasharray", tail + " " + (100 - tail));
      tEl.setAttribute("stroke-dashoffset", -(pct - tail));
      var tdEl = $(".cm-tail-dim", s15);
      tdEl.setAttribute("stroke-dasharray", tailDim + " " + (100 - tailDim));
      tdEl.setAttribute("stroke-dashoffset", -(pct - tailDim));
      var hp = polar(100, 100, 82, 135 + (pct / 100) * 270);
      var head = $(".cm-head", s15);
      head.setAttribute("cx", hp.x);
      head.setAttribute("cy", hp.y);
      $(".cm-speed", s15).textContent = kmh;
    }
  }

  window.SpeedHud = { setSpeed: setSpeed };

  /* ---------- FiveM NUI köprüsü ---------- */
  window.addEventListener("message", function (e) {
    var data = e.data;
    if (!data || data.type !== "carhud" || typeof data.speed !== "number") return;
    setSpeed(data.speed);
  });
})();
