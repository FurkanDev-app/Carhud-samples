/* ============================================================
   EV Gallery — elektrikli araç tarzı 8 hız göstergesi
   window.EvHud.set({ speed, power, battery, range })
     speed   → km/h
     power   → kW (negatif = rejeneratif frenleme)
     battery → % (0-100)
     range   → km (tahmini menzil)
   FiveM NUI mesajı (type: 'carhud') otomatik dinlenir.
   ============================================================ */

(function () {
  "use strict";

  var MAX_SPEED = 260;  // km/h
  var MAX_POWER = 300;  // kW
  var MAX_REGEN = 80;   // kW

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

  var BOLT = '<svg viewBox="0 0 12 20" class="ev-bolt"><path d="M7 0 L0 12 L5 12 L4 20 L12 7 L6.5 7 Z"/></svg>';

  /* ---------- T01 Minimal: Tesla tarzı sade + merkez sıfırlı güç barı ---------- */

  var t01 = $("#t01");
  if (t01) {
    t01.innerHTML =
      '<div class="tm-speedrow"><span class="tm-speed">0</span>' +
      '<span class="tm-unit">KM/H</span></div>' +
      '<div class="tm-powerbar">' +
      '<div class="tm-half regen"><div class="tm-fill rf"></div></div>' +
      '<span class="tm-zero"></span>' +
      '<div class="tm-half power"><div class="tm-fill pf"></div></div>' +
      "</div>";
  }

  /* ---------- T02 EV Arc: 270° yay + kW okuması ---------- */

  var t02 = $("#t02");
  if (t02) {
    var d02 = arc(100, 100, 82, 135, 270);
    t02.innerHTML =
      '<svg viewBox="0 0 200 200">' +
      '<path class="ta-track" d="' + d02 + '" pathLength="100"/>' +
      '<path class="ta-progress" d="' + d02 + '" pathLength="100" stroke-dasharray="0 100"/>' +
      '<text class="ta-speed" x="100" y="102" text-anchor="middle">0</text>' +
      '<text class="ta-unit" x="100" y="122" text-anchor="middle">KM/H</text>' +
      '<text class="ta-kw" x="100" y="150" text-anchor="middle">0 kW</text>' +
      "</svg>";
  }

  /* ---------- T03 Power Ring: sağ yarı güç, sol yarı rejen ---------- */

  var t03 = $("#t03");
  if (t03) {
    // sağ yarı: -90°'den +90°'ye (güç, saat yönü); sol yarı: -90°'den -270°'ye (rejen, saat yönü tersi)
    var dPow = arc(100, 100, 80, -90, 180);
    var s3 = polar(100, 100, 80, -90), e3 = polar(100, 100, 80, -270);
    var dReg = "M " + s3.x + " " + s3.y + " A 80 80 0 0 0 " + e3.x + " " + e3.y;
    t03.innerHTML =
      '<svg viewBox="0 0 200 200">' +
      '<circle class="tr-track" cx="100" cy="100" r="80"/>' +
      '<path class="tr-pow" d="' + dPow + '" pathLength="100" stroke-dasharray="0 100"/>' +
      '<path class="tr-reg" d="' + dReg + '" pathLength="100" stroke-dasharray="0 100"/>' +
      '<text class="tr-speed" x="100" y="98" text-anchor="middle">0</text>' +
      '<text class="tr-unit" x="100" y="118" text-anchor="middle">KM/H</text>' +
      '<text class="tr-kw" x="100" y="142" text-anchor="middle">0 kW</text>' +
      '<text class="tr-lbl-r" x="168" y="104" text-anchor="middle">PWR</text>' +
      '<text class="tr-lbl-l" x="32" y="104" text-anchor="middle">REG</text>' +
      "</svg>";
  }

  /* ---------- T04 Range Card: hız + batarya + menzil ---------- */

  var t04 = $("#t04");
  if (t04) {
    t04.innerHTML =
      '<div class="tg-top"><span class="tg-speed">0</span>' +
      '<span class="tg-unit">KM/H</span></div>' +
      '<div class="tg-batrow">' +
      '<div class="tg-battrack"><div class="tg-batfill"></div></div>' +
      '<span class="tg-batpct">100%</span>' +
      "</div>" +
      '<div class="tg-rangerow"><span class="tg-rangelabel">Menzil</span>' +
      '<span class="tg-range">0 km</span></div>';
  }

  /* ---------- T05 Volt Segments: şimşekli segment bar ---------- */

  var t05 = $("#t05");
  if (t05) {
    var segs5 = "";
    for (var s5 = 0; s5 < 14; s5++) segs5 += '<span class="tv-seg"></span>';
    t05.innerHTML =
      '<div class="tv-row">' + BOLT +
      '<span class="tv-speed">0</span><span class="tv-unit">KM/H</span></div>' +
      '<div class="tv-segs">' + segs5 + "</div>";
  }

  /* ---------- T06 Mini Cluster: hız + batarya + güç tek panelde ---------- */

  var t06 = $("#t06");
  if (t06) {
    var d06 = arc(130, 96, 78, 180, 180);
    t06.innerHTML =
      '<svg class="tc-arc" viewBox="0 0 260 100">' +
      '<path class="tc-track" d="' + d06 + '" pathLength="100"/>' +
      '<path class="tc-progress" d="' + d06 + '" pathLength="100" stroke-dasharray="0 100"/>' +
      "</svg>" +
      '<div class="tc-body">' +
      '<div class="tc-side"><span class="tc-sidelabel">BAT</span>' +
      '<span class="tc-bat">100%</span></div>' +
      '<div class="tc-center"><span class="tc-speed">0</span>' +
      '<span class="tc-unit">KM/H</span></div>' +
      '<div class="tc-side"><span class="tc-sidelabel">GÜÇ</span>' +
      '<span class="tc-kw">0kW</span></div>' +
      "</div>";
  }

  /* ---------- T07 Neo Digital: neon dijital + READY ---------- */

  var t07 = $("#t07");
  if (t07) {
    t07.innerHTML =
      '<div class="tn-ready"><i class="tn-dot"></i>READY</div>' +
      '<div class="tn-row"><span class="tn-speed">0</span>' +
      '<span class="tn-unit">KM/H</span></div>' +
      '<div class="tn-line"></div>';
  }

  /* ---------- T08 Regen Meter: merkez sıfırlı güç ölçer ---------- */

  var t08 = $("#t08");
  if (t08) {
    var ticks8 = "";
    for (var i8 = 0; i8 <= 10; i8++) {
      ticks8 += '<span class="tg8-tick' + (i8 === 5 ? " mid" : "") + '"></span>';
    }
    t08.innerHTML =
      '<div class="tg8-speedrow"><span class="tg8-speed">0</span>' +
      '<span class="tg8-unit">KM/H</span></div>' +
      '<div class="tg8-meter">' +
      '<div class="tg8-fill reg"></div><div class="tg8-fill pow"></div>' +
      '<span class="tg8-needle"></span>' +
      "</div>" +
      '<div class="tg8-ticks">' + ticks8 + "</div>" +
      '<div class="tg8-labels"><span>REGEN</span><span>0</span><span>POWER</span></div>';
  }

  /* ============================================================
     Güncelleme API'si
     ============================================================ */

  function set(d) {
    var spd = typeof d.speed === "number" ? clamp(Math.round(d.speed), 0, 999) : null;
    var pw = typeof d.power === "number" ? d.power : null;
    var spdPct = spd === null ? null : clamp(spd / MAX_SPEED, 0, 1) * 100;
    var powPct = pw === null ? null : clamp(pw / MAX_POWER, 0, 1) * 100;
    var regPct = pw === null ? null : clamp(-pw / MAX_REGEN, 0, 1) * 100;

    if (spd !== null) {
      if (t01) $(".tm-speed", t01).textContent = spd;
      if (t02) {
        $(".ta-speed", t02).textContent = spd;
        $(".ta-progress", t02).setAttribute("stroke-dasharray", spdPct + " 100");
      }
      if (t03) $(".tr-speed", t03).textContent = spd;
      if (t04) $(".tg-speed", t04).textContent = spd;
      if (t05) {
        $(".tv-speed", t05).textContent = spd;
        var vsegs = $$(".tv-seg", t05);
        var onV = Math.round((spdPct / 100) * vsegs.length);
        vsegs.forEach(function (el, i) { el.classList.toggle("on", i < onV); });
      }
      if (t06) {
        $(".tc-speed", t06).textContent = spd;
        $(".tc-progress", t06).setAttribute("stroke-dasharray", spdPct + " 100");
      }
      if (t07) $(".tn-speed", t07).textContent = spd;
      if (t08) $(".tg8-speed", t08).textContent = spd;
    }

    if (pw !== null) {
      var kwText = Math.round(pw) + " kW";
      if (t01) {
        $(".tm-fill.pf", t01).style.width = powPct + "%";
        $(".tm-fill.rf", t01).style.width = regPct + "%";
      }
      if (t02) $(".ta-kw", t02).textContent = kwText;
      if (t03) {
        $(".tr-pow", t03).setAttribute("stroke-dasharray", powPct + " 100");
        $(".tr-reg", t03).setAttribute("stroke-dasharray", regPct + " 100");
        $(".tr-kw", t03).textContent = kwText;
      }
      if (t06) $(".tc-kw", t06).textContent = Math.round(Math.abs(pw)) + "kW";
      if (t08) {
        $(".tg8-fill.pow", t08).style.width = (powPct / 2) + "%";
        $(".tg8-fill.reg", t08).style.width = (regPct / 2) + "%";
        var nPos = 50 + (pw >= 0 ? powPct : -regPct) / 2;
        $(".tg8-needle", t08).style.left = clamp(nPos, 0, 100) + "%";
      }
      if (t07) t07.classList.toggle("charging", pw < -5);
    }

    if (typeof d.battery === "number") {
      var bat = clamp(d.battery, 0, 100);
      if (t04) {
        var bf = $(".tg-batfill", t04);
        bf.style.width = bat + "%";
        bf.classList.toggle("low", bat < 20);
        $(".tg-batpct", t04).textContent = Math.round(bat) + "%";
        t04.classList.toggle("low", bat < 20);
      }
      if (t06) $(".tc-bat", t06).textContent = Math.round(bat) + "%";
    }

    if (typeof d.range === "number" && t04) {
      $(".tg-range", t04).textContent = Math.round(d.range) + " km";
    }
  }

  window.EvHud = { set: set };

  /* ---------- FiveM NUI köprüsü ---------- */
  window.addEventListener("message", function (e) {
    var data = e.data;
    if (!data || data.type !== "carhud") return;
    set(data);
  });
})();
