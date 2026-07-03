/* ============================================================
   Ice Mono — NFS tarzı monokrom takometre (bağımsız)
   Gri segmentli bant, banda paralel 0-10 rakamları, buz mavisi
   redline, halka göbekli ince ibre, iç kesik yaylar ve bandın
   alt boşluğuna hizalanmış dijital hız.

   window.IceMono.set({ speed, rpm, throttle })
     speed    → km/h (kadran MPH gösterir)
     rpm      → 0-1 (ibre)
     throttle → 0-1 (iç yay; isteğe bağlı)
   FiveM NUI mesajı (type: 'carhud') otomatik dinlenir.
   ============================================================ */

(function () {
  "use strict";

  var START = 135, SWEEP = 270, C = 115;
  var ACCENT = "#4db8ff";

  function $(sel, root) { return (root || document).querySelector(sel); }
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

  var widget = $("#iceMono");
  if (widget) {
    var bandD = arc(C, C, 100, START, SWEEP);
    var html = '<svg viewBox="0 0 230 230">';
    html += '<circle cx="' + C + '" cy="' + C + '" r="112" fill="#202226"/>';
    html += '<path d="' + bandD + '" fill="none" stroke="rgba(190,196,205,.28)" stroke-width="17"/>';
    html += '<path d="' + arc(C, C, 100, START + SWEEP * 0.9, SWEEP * 0.1) +
            '" fill="none" stroke="' + ACCENT + '" stroke-width="17"/>';

    var ticks = "";
    for (var v = 0; v <= 10; v += 0.5) {
      var deg = START + (v / 10) * SWEEP;
      var major = v % 1 === 0;
      var p1 = polar(C, C, 109, deg), p2 = polar(C, C, 91, deg);
      ticks += '<line x1="' + p1.x + '" y1="' + p1.y + '" x2="' + p2.x + '" y2="' + p2.y +
               '" stroke="' + (major ? "#f2f4f7" : "rgba(242,244,247,.35)") +
               '" stroke-width="' + (major ? 3 : 1.5) + '"/>';
      if (major) {
        var t = polar(C, C, 73, deg);
        ticks += '<text x="' + t.x + '" y="' + t.y + '" text-anchor="middle" dy="6" ' +
                 'transform="rotate(' + (deg + 90) + " " + t.x + " " + t.y + ')" ' +
                 'class="im-num">' + v + "</text>";
      }
    }
    html += ticks;

    // iç kesik yaylar (dıştaki throttle ile dolar)
    html += '<path d="' + arc(C, C, 52, 160, 200) +
            '" fill="none" stroke="rgba(190,196,205,.3)" stroke-width="9"/>';
    html += '<path class="im-inner" d="' + arc(C, C, 38, 200, 130) +
            '" fill="none" stroke="rgba(190,196,205,.22)" stroke-width="7"' +
            ' pathLength="100" stroke-dasharray="100 100"/>';

    // ibre + halka göbek
    html += '<g class="im-needle">' +
            '<line x1="' + C + '" y1="' + C + '" x2="' + (C - 92) + '" y2="' + C +
            '" stroke="#eef1f5" stroke-width="3.5" stroke-linecap="round"/>' +
            '<line x1="' + C + '" y1="' + C + '" x2="' + (C + 20) + '" y2="' + C +
            '" stroke="#eef1f5" stroke-width="5" stroke-linecap="round"/></g>';
    html += '<circle cx="' + C + '" cy="' + C + '" r="12" fill="#202226" stroke="#eef1f5" stroke-width="5"/>';

    // dijital hız — bandın alt boşluğunda, ortalanmış
    html += '<text class="im-speed" x="' + C + '" y="182" text-anchor="middle">0</text>' +
            '<text class="im-mph" x="' + C + '" y="200" text-anchor="middle">MPH</text>';
    html += "</svg>";
    widget.innerHTML = html;
  }

  function set(d) {
    if (!widget) return;
    if (typeof d.rpm === "number") {
      $(".im-needle", widget).style.transform =
        "rotate(" + (START + clamp(d.rpm, 0, 1) * SWEEP - 180) + "deg)";
    }
    if (typeof d.throttle === "number") {
      $(".im-inner", widget).setAttribute(
        "stroke-dasharray", clamp(d.throttle, 0, 1) * 100 + " 100");
    }
    if (typeof d.speed === "number") {
      $(".im-speed", widget).textContent =
        Math.round(clamp(d.speed * 0.621371, 0, 999));
    }
  }

  window.IceMono = { set: set };

  /* ---------- FiveM NUI köprüsü ---------- */
  window.addEventListener("message", function (e) {
    var data = e.data;
    if (!data || data.type !== "carhud") return;
    set(data);
  });
})();
