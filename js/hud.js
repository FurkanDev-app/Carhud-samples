/* ============================================================
   CarHUD Samples — widget güncelleme katmanı
   Tasarım odaklı örneklerdir; FiveM tarafında NUI mesajıyla
   beslemek için en alttaki message listener'ı kullanın.
   ============================================================ */

(function () {
  "use strict";

  var MAX_SPEED = 240;   // km/h — gösterge tavanı
  var MAX_RPM = 1.0;     // GetVehicleCurrentRpm 0..1 döner
  var RPM_SEGMENTS = 12; // son 3 segment kırmızı bölge

  /* ---------- yardımcılar ---------- */

  function clamp(v, min, max) { return Math.min(max, Math.max(min, v)); }

  function polar(cx, cy, r, deg) {
    var rad = (deg * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  // startDeg → startDeg+sweepDeg (saat yönü) yay path'i
  function arcPath(cx, cy, r, startDeg, sweepDeg) {
    var s = polar(cx, cy, r, startDeg);
    var e = polar(cx, cy, r, startDeg + sweepDeg);
    var large = sweepDeg > 180 ? 1 : 0;
    return "M " + s.x + " " + s.y + " A " + r + " " + r + " 0 " + large + " 1 " + e.x + " " + e.y;
  }

  /* ============================================================
     01 — Classic Gauge
     Yay: 135° başlangıç, 270° süpürme (fotoğraftaki düzen)
     ============================================================ */

  var gc = document.getElementById("gaugeClassic");
  var GC_START = 135, GC_SWEEP = 270, GC_R = 118;

  if (gc) {
    var track = gc.querySelector(".gc-track");
    var progress = gc.querySelector(".gc-progress");
    var d = arcPath(150, 150, GC_R, GC_START, GC_SWEEP);
    track.setAttribute("d", d);
    progress.setAttribute("d", d);
    progress.setAttribute("pathLength", "100");
    track.setAttribute("pathLength", "100");
    progress.setAttribute("stroke-dasharray", "0 100");

    // tick + rakamlar (her 20 km/h'de rakam, her 10'da küçük çizgi)
    var ticks = gc.querySelector(".gc-ticks");
    var svgNS = "http://www.w3.org/2000/svg";
    for (var v = 0; v <= MAX_SPEED; v += 10) {
      var deg = GC_START + (v / MAX_SPEED) * GC_SWEEP;
      var major = v % 20 === 0;
      var o = polar(150, 150, 108, deg);
      var i = polar(150, 150, major ? 98 : 102, deg);
      var line = document.createElementNS(svgNS, "line");
      line.setAttribute("x1", o.x); line.setAttribute("y1", o.y);
      line.setAttribute("x2", i.x); line.setAttribute("y2", i.y);
      if (!major) line.setAttribute("class", "minor");
      ticks.appendChild(line);
      if (major && v % 40 === 0) {
        var tp = polar(150, 150, 84, deg);
        var text = document.createElementNS(svgNS, "text");
        text.setAttribute("x", tp.x); text.setAttribute("y", tp.y + 5);
        text.setAttribute("text-anchor", "middle");
        text.textContent = v;
        ticks.appendChild(text);
      }
    }
  }

  /* ============================================================
     02 — Modern Arc  (135° başlangıç, 270° süpürme, uçta boşluk)
     ============================================================ */

  var ga = document.getElementById("gaugeArc");
  if (ga) {
    var gaTrack = ga.querySelector(".ga-track");
    var gaProgress = ga.querySelector(".ga-progress");
    var gaD = arcPath(150, 150, 122, 135, 270);
    gaTrack.setAttribute("d", gaD);
    gaProgress.setAttribute("d", gaD);
    gaTrack.setAttribute("pathLength", "100");
    gaProgress.setAttribute("pathLength", "100");
    gaProgress.setAttribute("stroke-dasharray", "0 100");
  }

  /* ============================================================
     04 — RPM Strip segmentleri
     ============================================================ */

  var rpmWrap = document.querySelector("#rpmStrip .rpm-segments");
  if (rpmWrap) {
    for (var s2 = 0; s2 < RPM_SEGMENTS; s2++) {
      var seg = document.createElement("div");
      seg.className = "rpm-seg" + (s2 >= RPM_SEGMENTS - 3 ? " red" : "");
      rpmWrap.appendChild(seg);
    }
  }

  /* ============================================================
     Genel API — tüm widget'ları tek noktadan besler
     ============================================================ */

  var CarHud = {
    setSpeed: function (kmh) {
      kmh = clamp(Math.round(kmh), 0, MAX_SPEED);
      var pct = (kmh / MAX_SPEED) * 100;

      if (gc) {
        gc.querySelector(".gc-progress").setAttribute("stroke-dasharray", pct + " 100");
        gc.querySelector(".gc-needle").style.transform =
          "rotate(" + (GC_START + (kmh / MAX_SPEED) * GC_SWEEP) + "deg)";
        gc.querySelector(".gc-speed").textContent = kmh;
      }
      if (ga) {
        ga.querySelector(".ga-progress").setAttribute("stroke-dasharray", pct + " 100");
        ga.querySelector(".ga-speed").textContent = kmh;
      }
      var dg = document.querySelector("#digital .dg-speed");
      if (dg) dg.textContent = kmh;

      var pill = document.getElementById("pill");
      if (pill) {
        pill.querySelector(".pill-speed").textContent = kmh;
        pill.querySelector(".pill-progress").setAttribute("stroke-dasharray", pct + " 100");
      }
    },

    setRpm: function (rpm) {
      rpm = clamp(rpm, 0, MAX_RPM);
      var segs = document.querySelectorAll("#rpmStrip .rpm-seg");
      var on = Math.round((rpm / MAX_RPM) * segs.length);
      segs.forEach(function (el, idx) { el.classList.toggle("on", idx < on); });
    },

    setGear: function (gear) {
      var label = gear === 0 ? "R" : gear === -1 ? "N" : String(gear);
      ["#gaugeArc .ga-gear", "#digital .dg-gear", "#rpmStrip .rpm-gear", "#pill .pill-gear"]
        .forEach(function (sel) {
          var el = document.querySelector(sel);
          if (el) el.textContent = label;
        });
    },

    setFuel: function (pct) {
      pct = clamp(pct, 0, 100);
      var gaFill = document.querySelector("#gaugeArc .ga-fuel-fill");
      if (gaFill) {
        gaFill.style.width = pct + "%";
        gaFill.classList.toggle("low", pct < 20);
      }
      var row = document.querySelector('#statusBars .st-row[data-key="fuel"]');
      if (row) {
        var fill = row.querySelector(".st-fill");
        fill.style.width = pct + "%";
        fill.classList.toggle("low", pct < 20);
        row.querySelector(".st-val").textContent = Math.round(pct) + "%";
      }
    },

    setEngine: function (pct) {
      pct = clamp(pct, 0, 100);
      var row = document.querySelector('#statusBars .st-row[data-key="engine"]');
      if (row) {
        var fill = row.querySelector(".st-fill");
        fill.style.width = pct + "%";
        fill.classList.toggle("low", pct < 25);
        row.querySelector(".st-val").textContent = Math.round(pct) + "%";
      }
    },

    setSeatbelt: function (on) {
      var el = document.querySelector("#statusBars .st-belt-state");
      if (el) {
        el.textContent = on ? "ON" : "OFF";
        el.classList.toggle("on", on);
        el.classList.toggle("off", !on);
      }
    }
  };

  window.CarHud = CarHud;

  /* ============================================================
     FiveM NUI köprüsü — client.lua'dan SendNUIMessage ile:
       SendNUIMessage({ type = "carhud",
         speed = kmh, rpm = 0.0-1.0, gear = n,
         fuel = 0-100, engine = 0-100, seatbelt = true })
     ============================================================ */

  window.addEventListener("message", function (e) {
    var data = e.data;
    if (!data || data.type !== "carhud") return;
    if (typeof data.speed === "number") CarHud.setSpeed(data.speed);
    if (typeof data.rpm === "number") CarHud.setRpm(data.rpm);
    if (typeof data.gear === "number") CarHud.setGear(data.gear);
    if (typeof data.fuel === "number") CarHud.setFuel(data.fuel);
    if (typeof data.engine === "number") CarHud.setEngine(data.engine);
    if (typeof data.seatbelt === "boolean") CarHud.setSeatbelt(data.seatbelt);
  });
})();
