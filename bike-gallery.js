/* ============================================================
   Bike Gallery — bisiklet bilgisayarı tarzı 8 widget
   (referans: Garmin Edge — siyah zemin, blok beyaz rakamlar,
    ince bölme çizgileri, küçük gri etiketler)

   window.BikeHud.set({ speed, hr, power, cadence, elev,
                        grade, dist, time, battery, assist })
   FiveM NUI mesajı (type: 'carhud') otomatik dinlenir.
   ============================================================ */

(function () {
  "use strict";

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return (root || document).querySelectorAll(sel); }
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }

  var BIKE_ICON =
    '<svg viewBox="0 0 44 28" class="bike-icon">' +
    '<circle cx="9" cy="19" r="7"/><circle cx="35" cy="19" r="7"/>' +
    '<path d="M9 19 L17 8 L28 8 M17 8 L22 19 L35 19 M22 19 L28 8 L31 4 M26 4 L31 4"/>' +
    "</svg>";

  /* ---------- B01 Edge Panel: fotoğraftaki tam düzen ---------- */

  var b01 = $("#b01");
  if (b01) {
    b01.innerHTML =
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

  /* ---------- B02 Speed Field: tek alan, dev rakam ---------- */

  var b02 = $("#b02");
  if (b02) {
    b02.innerHTML =
      '<div class="bk-panel">' +
      '<span class="bk-label">Speed</span>' +
      '<div class="bs-row"><span class="bs-val">0.0</span><small>KM/H</small></div>' +
      '<div class="bs-max"><span class="bk-label">Max</span><span class="bs-maxval">0.0</span></div>' +
      "</div>";
  }

  /* ---------- B03 Heart Rate: nabız + 5 bölge ---------- */

  var b03 = $("#b03");
  if (b03) {
    var zones3 = "";
    for (var z = 0; z < 5; z++) zones3 += '<span class="hz-seg hz' + (z + 1) + '"></span>';
    b03.innerHTML =
      '<div class="bk-panel">' +
      '<span class="bk-label">Heart Rate</span>' +
      '<div class="bh-row"><i class="bh-heart"></i>' +
      '<span class="bh-val">0</span><small>BPM</small></div>' +
      '<div class="bh-zones">' + zones3 + "</div>" +
      "</div>";
  }

  /* ---------- B04 Power: watt + 7 güç bölgesi ---------- */

  var b04 = $("#b04");
  if (b04) {
    var zones4 = "";
    for (var z4 = 0; z4 < 7; z4++) zones4 += '<span class="pz-seg pz' + (z4 + 1) + '"></span>';
    b04.innerHTML =
      '<div class="bk-panel">' +
      '<span class="bk-label">Power</span>' +
      '<div class="bp-row"><span class="bp-val">0</span><small>W</small></div>' +
      '<div class="bp-zones">' + zones4 + "</div>" +
      '<div class="bp-foot"><span class="bk-label">3s Avg</span><span class="bp-avg">0</span></div>' +
      "</div>";
  }

  /* ---------- B05 Cadence: dönen krank ---------- */

  var b05 = $("#b05");
  if (b05) {
    b05.innerHTML =
      '<div class="bk-panel bk-cad">' +
      '<div class="bc-crankwrap"><svg viewBox="0 0 60 60">' +
      '<circle class="bc-ring" cx="30" cy="30" r="26"/>' +
      '<g class="bc-crank"><line x1="30" y1="30" x2="30" y2="8"/>' +
      '<line x1="30" y1="30" x2="30" y2="52" opacity=".45"/>' +
      '<circle class="bc-pedal" cx="30" cy="8" r="4"/>' +
      '<circle class="bc-pedal" cx="30" cy="52" r="4" opacity=".45"/></g>' +
      '<circle class="bc-hub" cx="30" cy="30" r="4"/>' +
      "</svg></div>" +
      '<div class="bc-read"><span class="bk-label">Cadence</span>' +
      '<div class="bc-row"><span class="bc-val">0</span><small>RPM</small></div></div>' +
      "</div>";
  }

  /* ---------- B06 Climb: irtifa + eğim ---------- */

  var b06 = $("#b06");
  if (b06) {
    b06.innerHTML =
      '<div class="bk-panel">' +
      '<div class="cl-top">' +
      '<div><span class="bk-label">Elevation</span>' +
      '<div class="cl-row"><span class="cl-elev">0</span><small>FT</small></div></div>' +
      '<div class="cl-gradebox"><span class="bk-label">Grade</span>' +
      '<span class="cl-grade">0%</span></div>' +
      "</div>" +
      '<svg class="cl-slope" viewBox="0 0 160 36">' +
      '<line class="cl-base" x1="6" y1="30" x2="154" y2="30"/>' +
      '<line class="cl-road" x1="18" y1="30" x2="142" y2="30"/>' +
      '<circle class="cl-rider" cx="80" cy="30" r="4"/>' +
      "</svg>" +
      "</div>";
  }

  /* ---------- B07 Trip: mesafe / süre / ortalama ---------- */

  var b07 = $("#b07");
  if (b07) {
    b07.innerHTML =
      '<div class="bk-panel bk-trip">' +
      '<div class="tr-field"><span class="bk-label">Distance</span>' +
      '<div class="tr-row"><span class="tr-dist">0.00</span><small>KM</small></div></div>' +
      '<div class="tr-sub">' +
      '<div class="tr-field"><span class="bk-label">Time</span>' +
      '<span class="tr-time">0:00</span></div>' +
      '<div class="tr-field"><span class="bk-label">Avg Spd</span>' +
      '<span class="tr-avg">0.0</span></div>' +
      "</div></div>";
  }

  /* ---------- B08 E-Bike: batarya + destek modu ---------- */

  var b08 = $("#b08");
  var ASSIST_MODES = ["OFF", "ECO", "TOUR", "TURBO"];
  if (b08) {
    var cells8 = "";
    for (var c8 = 0; c8 < 5; c8++) cells8 += '<span class="eb-cell"></span>';
    var modes8 = "";
    ASSIST_MODES.forEach(function (m) {
      modes8 += '<span class="eb-mode" data-m="' + m + '">' + m + "</span>";
    });
    b08.innerHTML =
      '<div class="bk-panel bk-ebike">' +
      '<div class="eb-batwrap"><span class="bk-label">Battery</span>' +
      '<div class="eb-batt"><div class="eb-cells">' + cells8 + '</div><span class="eb-cap"></span></div>' +
      '<span class="eb-pct">100%</span></div>' +
      '<div class="eb-assist"><span class="bk-label">Assist</span>' +
      '<div class="eb-modes">' + modes8 + "</div></div>" +
      "</div>";
  }

  /* ============================================================
     Güncelleme API'si
     ============================================================ */

  var maxSpeed = 0;
  var crankAngle = 0;
  var pwrHist = [];

  function fmtTime(sec) {
    sec = Math.max(0, Math.round(sec));
    var h = Math.floor(sec / 3600), m = Math.floor((sec % 3600) / 60), s = sec % 60;
    var mm = h > 0 && m < 10 ? "0" + m : String(m);
    var ss = s < 10 ? "0" + s : String(s);
    return (h > 0 ? h + ":" : "") + mm + ":" + ss;
  }

  function set(d) {
    if (typeof d.speed === "number") {
      var spd = Math.max(0, d.speed);
      maxSpeed = Math.max(maxSpeed, spd);
      if (b01) $(".eg-speed", b01).textContent = spd.toFixed(1);
      if (b02) {
        $(".bs-val", b02).textContent = spd.toFixed(1);
        $(".bs-maxval", b02).textContent = maxSpeed.toFixed(1);
      }
    }

    if (typeof d.hr === "number") {
      var hr = clamp(Math.round(d.hr), 0, 230);
      if (b01) $(".eg-hr", b01).textContent = hr;
      if (b03) {
        $(".bh-val", b03).textContent = hr;
        // bölgeler: <120 z1, <135 z2, <150 z3, <165 z4, üstü z5
        var zi = hr < 120 ? 0 : hr < 135 ? 1 : hr < 150 ? 2 : hr < 165 ? 3 : 4;
        $$(".hz-seg", b03).forEach(function (el, i) {
          el.classList.toggle("on", i === zi);
        });
        $(".bh-heart", b03).style.animationDuration =
          hr > 0 ? (60 / hr).toFixed(2) + "s" : "1s";
      }
    }

    if (typeof d.power === "number") {
      var pwr = clamp(Math.round(d.power), 0, 1999);
      pwrHist.push(pwr);
      if (pwrHist.length > 30) pwrHist.shift();
      var avg = Math.round(pwrHist.reduce(function (a, b) { return a + b; }, 0) / pwrHist.length);
      if (b01) $(".eg-pwr", b01).textContent = pwr;
      if (b04) {
        $(".bp-val", b04).textContent = pwr;
        $(".bp-avg", b04).textContent = avg;
        var pz = clamp(Math.floor(pwr / 55), 0, 6);
        $$(".pz-seg", b04).forEach(function (el, i) {
          el.classList.toggle("on", i <= pz);
        });
      }
    }

    if (typeof d.cadence === "number" && b05) {
      var cad = clamp(Math.round(d.cadence), 0, 200);
      crankAngle = (crankAngle + cad * 0.6) % 360;
      $(".bc-crank", b05).style.transform = "rotate(" + crankAngle + "deg)";
      $(".bc-val", b05).textContent = cad;
    }

    if (typeof d.elev === "number") {
      var elev = Math.round(d.elev);
      if (b01) $(".eg-elev", b01).textContent = elev;
      if (b06) $(".cl-elev", b06).textContent = elev;
    }

    if (typeof d.grade === "number" && b06) {
      var gr = clamp(d.grade, -25, 25);
      var gEl = $(".cl-grade", b06);
      gEl.textContent = (gr > 0 ? "+" : "") + gr.toFixed(1) + "%";
      gEl.className = "cl-grade " +
        (Math.abs(gr) < 5 ? "g-easy" : Math.abs(gr) < 10 ? "g-mid" : "g-hard");
      $(".cl-road", b06).style.transform = "rotate(" + -gr * 1.4 + "deg)";
      $(".cl-rider", b06).style.transform =
        "translateY(" + -Math.tan((gr * 1.4 * Math.PI) / 180) * 0 + "px)";
    }

    if (b07) {
      if (typeof d.dist === "number") $(".tr-dist", b07).textContent = d.dist.toFixed(2);
      if (typeof d.time === "number") $(".tr-time", b07).textContent = fmtTime(d.time);
      if (typeof d.dist === "number" && typeof d.time === "number" && d.time > 0) {
        $(".tr-avg", b07).textContent = ((d.dist / d.time) * 3600).toFixed(1);
      }
    }

    if (b08) {
      if (typeof d.battery === "number") {
        var bat = clamp(d.battery, 0, 100);
        var onC = Math.ceil((bat / 100) * 5);
        $$(".eb-cell", b08).forEach(function (el, i) {
          el.classList.toggle("on", i < onC);
        });
        $(".eb-pct", b08).textContent = Math.round(bat) + "%";
        b08.classList.toggle("low", bat < 20);
      }
      if (typeof d.assist === "number") {
        var ai = clamp(Math.round(d.assist), 0, 3);
        $$(".eb-mode", b08).forEach(function (el, i) {
          el.classList.toggle("active", i === ai);
        });
      }
    }
  }

  window.BikeHud = { set: set };

  /* ---------- FiveM NUI köprüsü ---------- */
  window.addEventListener("message", function (e) {
    var data = e.data;
    if (!data || data.type !== "carhud") return;
    set(data);
  });
})();
