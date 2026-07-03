# CarHUD Samples

> **Seçilen tasarımlar:** [`selected/`](selected/) klasöründe — Classic Gauge,
> A1 Horizon, S01 Dash Arc, S02 Wings, F01 Altimeter, F02 Attitude,
> F05 Turn Coordinator. Bağımsız pakettir, doğrudan FiveM resource'una
> kopyalanabilir. Kullanım: [`selected/README.md`](selected/README.md)

FiveM HUD script'lerinde kullanılabilecek **araç HUD widget tasarım örnekleri**.
Referans görseldeki koyu lacivert zemin + cyan glow + altın vurgu paleti baz alınmıştır.
Sadece tasarım içerir — oyun mantığı yoktur, kendi client script'inize bağlarsınız.

## Önizleme

`index.html` dosyasını tarayıcıda açın; demo verisi (sahte hız/rpm/yakıt) otomatik oynar.

## Widget'lar

| # | Widget | Açıklama |
|---|--------|----------|
| 01 | **Classic Gauge** | Fotoğraftaki stil: yuvarlak ibreli gösterge, cyan glow halka, tick rakamları |
| 02 | **Modern Arc** | 270° gradyan yay, dijital hız, vites ve mikro yakıt barı |
| 03 | **Digital Compact** | Minimal dijital kutu: hız + vites, altın vurgu |
| 04 | **RPM Strip** | Segmentli devir barı, kırmızı bölge, vites göstergesi |
| 05 | **Status Bars** | Yakıt / motor sağlığı barları + yanıp sönen kemer uyarısı |
| 06 | **Mini Pill** | Ekran köşesi için ultra kompakt kapsül (hız halkası + vites) |

## Classic Gauge temaları

Ana widget olan **Classic Gauge** artık yeniden kullanılabilir bir bileşen:
`classic-themes.html` dosyasını tarayıcıda açarak 6 temayı izleyebilirsiniz.

| Tema | Sınıf | Palet |
|------|-------|-------|
| **Ice** | *(varsayılan)* | Lacivert + cyan glow (referans fotoğraf) |
| **Redline** | `theme-redline` | Karbon siyahı + kırmızı |
| **Toxic** | `theme-toxic` | Gece yeşili + neon yeşil |
| **Synthwave** | `theme-synth` | Mor + magenta |
| **Amber** | `theme-amber` | Retro / klasik otomobil kehribarı |
| **Ghost** | `theme-ghost` | Monokrom / minimal beyaz |

Kullanım — bir `div`'e sınıfı verip script'i eklemek yeterli:

```html
<link rel="stylesheet" href="css/classic-gauge.css">
<div class="js-classic-gauge theme-redline" data-max="240" data-unit="KM/H"></div>
<script src="js/classic-gauge.js"></script>
```

- `data-max` → gösterge tavanı (varsayılan 240)
- `data-unit` → birim etiketi (örn. `MPH`)
- Yeni tema = `css/classic-gauge.css` içindeki bir tema bloğunu kopyalayıp
  renk değişkenlerini değiştirmek.

## Widget Packs — 3 widget × 5 tasarım

`widget-packs.html` dosyasında üç widget paketi, her birinde 5 bağımsız tasarım bulunur:

| Paket | Tasarımlar |
|-------|-----------|
| **A — Speed** | Horizon (yarım yay) · Tower (dikey slat bar) · Hex (altıgen panel) · Blade (italik/agresif) · Orbit (nokta halkası) |
| **B — Fuel** | Ring (halka) · Tube (dikey depo) · Cells (segmentli) · Quarter (köşe yayı) · Pill (mini kapsül) |
| **C — RPM & Gear** | Tach (mini takometre) · Shift Lights (F1 stili LED) · Gear Ladder (vites şeridi) · Equalizer (yükselen barlar) · Core (vites çekirdeği) |

Tümü `window.HudV2` API'siyle (`setSpeed`, `setRpm`, `setGear`, `setFuel`) beslenir ve
aynı `carhud` NUI mesajını dinler. Yakıt %20'nin altına düşünce fuel tasarımları
kırmızıya döner; RPM kırmızı bölgeye girince Tach/Core kırmızılaşır, Shift Lights flaş yapar.
Kullanmayacağınız tasarımın HTML bloğunu silmeniz yeterli.

## Speed Gallery — 15 hız göstergesi tasarımı

`speed-gallery.html` dosyasında klasikten fanteziye 15 bağımsız hız göstergesi bulunur:

| # | Tasarım | Stil |
|---|---------|------|
| S01 | Dash Arc | Segmentli 270° yay (yaygın) |
| S02 | Wings | Simetrik çift kanat yay |
| S03 | Minimal | Sade dijital + ince çizgi (yaygın) |
| S04 | Squircle | Yuvarlak kare çevre progress (modern) |
| S05 | Retro LCD | 7 segment hayaletli amber panel (retro) |
| S06 | Aero Tape | Havacılık tipi kayan hız şeridi |
| S07 | Radar | Conic süpürme izi + iğne |
| S08 | Chevron Rush | Hızla yanan ok dizisi |
| S09 | Neon Tunnel | İçten dışa dolan 3 halka |
| S10 | Liquid Orb | Sıvı dolumlu cam küre (dalga animasyonlu) |
| S11 | Crystal | Elmas panel, ışık süpürmeli |
| S12 | Glitch | Cyberpunk köşe çerçevesi + RGB kayması |
| S13 | Slider | Dolum barını izleyen baloncuk |
| S14 | Vintage | Fildişi kadranlı klasik yarım analog |
| S15 | Comet | Halkada dolaşan kuyruklu nokta |

Tümü `window.SpeedHud.setSpeed(kmh)` ile beslenir ve aynı `carhud` NUI mesajını dinler.

## Aero Gallery — 15 uçak hız ölçer tasarımı

`aero-gallery.html` dosyasında havacılık temalı 15 bağımsız hız ölçer bulunur (birim: knot):

| # | Tasarım | Stil |
|---|---------|------|
| A01 | Steam ASI | Klasik airspeed indicator — renkli hız bantları (beyaz/yeşil/sarı) + redline |
| A02 | PFD Tape | Airliner glass cockpit şeridi — siyah okuma kutusu, magenta hız bug'ı |
| A03 | Combat HUD | Yeşil fosfor savaş uçağı HUD'u — scanline'lı, Mach okumalı |
| A04 | Mach Meter | 240° ibreli Mach kadranı + dijital pencere |
| A05 | Warbird | 2. Dünya Savaşı stili fildişi kadran, MPH |
| A06 | V-Bug Arc | V hızları işaretli modern yay (VR, VFE, VNO, VNE) |
| A07 | Glass Compact | Mini EFIS — trend oku + renkli hız bandı |
| A08 | Panoramic | 5. nesil geniş kokpit paneli — ince rakamlar + Mach |
| A09 | Mach Strip | Süpersonik yatay şerit — bölgeli, üçgen imleçli |
| A10 | Rotor | Helikopter — hızla dönen 3 palli pervane |
| A11 | Holo Ring | Hologram halka — dönen kesikli çember + flicker |
| A12 | Ground Tape | Yatay kayan HUD şeridi |
| A13 | IAS / TAS | Çift okuma paneli (TAS ≈ IAS × 1.15) |
| A14 | Afterburner | Art yakıcı barı — %80 üstünde AB rozeti yanar |
| A15 | Standby | Monokrom yedek gösterge — siyah/beyaz minimal |

Tümü `window.AeroHud.setSpeed(knot)` ile beslenir ve aynı `carhud` NUI mesajını dinler.
FiveM'de knot: `GetEntitySpeed(veh) * 1.94384`.

## Cockpit Gallery — 15 uçak göstergesi (tam set)

`cockpit-gallery.html` dosyasında hız dışındaki tüm temel uçak göstergeleri bulunur:

| # | Gösterge | Birim / Davranış |
|---|----------|------------------|
| F01 | Altimeter | Çift ibreli klasik altimetre (100/1000 ft) + dijital pencere |
| F02 | Attitude | Suni ufuk — pitch ladder + roll dönüşü, turuncu uçak sembolü |
| F03 | Heading | Dönen pusula gülü (N/E/S/W amber) + dijital istikamet |
| F04 | VSI | Varyometre ±2000 ft/min, UP/DN skalası |
| F05 | Turn Coord | Yatışla dönen uçak sembolü + kayma topu |
| F06 | AOA Indexer | F-18 tarzı hücum açısı ışıkları (chevron/donut) |
| F07 | G-Meter | -2..+8 G ibre + kırmızı tepe (peak) işareti |
| F08 | N1 Gauge | Motor devri %, 100 üstü kırmızı bölge |
| F09 | EGT | Egzoz sıcaklığı barı — yeşil/sarı/kırmızı bölgeler |
| F10 | Fuel Qty | Sol/sağ tank tüpleri (kg), %15 altında kırmızı blink |
| F11 | Oil | Yağ basıncı (psi) + sıcaklığı (°C), yeşil bant bölgeleri |
| F12 | Flaps | UP/1/2/FULL detentli pozisyon göstergesi |
| F13 | Landing Gear | 3 ışık: yeşil DOWN, kırmızı blink TRANSIT, sönük UP |
| F14 | Throttle | Gaz kolu pozisyonu, üstte AB (art yakıcı) bölgesi |
| F15 | Radar Alt | Yerden yükseklik + DH (karar yüksekliği) amber uyarısı |

Tümü `window.FlightHud.set({...})` ile beslenir; alanlar: `alt, vs, pitch, roll, hdg,
slip, aoa, g, n1, egt, fuelL, fuelR, oilP, oilT, flaps, gear, thr, ra`.
Aynı `carhud` NUI mesajı dinlenir.

## Dosya yapısı

```
index.html             → 6 farklı widget tipinin vitrini
classic-themes.html    → Classic Gauge tema varyantları vitrini
widget-packs.html      → 3 widget paketi × 5 tasarım vitrini
speed-gallery.html     → 15 hız göstergesi tasarımı vitrini
aero-gallery.html      → 15 uçak hız ölçer tasarımı vitrini
cockpit-gallery.html   → 15 uçak göstergesi (tam set) vitrini
selected/              → SEÇİLEN 7 tasarımın bağımsız paketi (taşımaya hazır)
css/hud.css            → widget vitrini stilleri
css/classic-gauge.css  → Classic Gauge çekirdek stil + 6 tema
css/widget-packs.css   → widget paketlerinin stilleri
js/hud.js              → vitrin widget API'si (CarHud.setSpeed vb.) + NUI listener
js/classic-gauge.js    → Classic Gauge bileşeni (createClassicGauge) + NUI listener
js/widget-packs.js     → widget paketleri API'si (HudV2) + NUI listener
js/speed-gallery.js    → hız galerisi API'si (SpeedHud) + NUI listener
js/aero-gallery.js     → uçak galerisi API'si (AeroHud) + NUI listener
js/cockpit-gallery.js  → kokpit seti API'si (FlightHud) + NUI listener
js/demo.js             → index.html sahte veri animasyonu — FiveM'e taşırken SİLİN
js/classic-demo.js     → classic-themes.html sahte veri animasyonu — FiveM'e taşırken SİLİN
js/widget-packs-demo.js→ widget-packs.html sahte veri animasyonu — FiveM'e taşırken SİLİN
```

## FiveM entegrasyonu

`hud.js` zaten `message` event'ini dinliyor. Client tarafında yeterli olan:

```lua
-- fxmanifest.lua
ui_page 'index.html'
files { 'index.html', 'css/hud.css', 'js/hud.js' }

-- client.lua
CreateThread(function()
    while true do
        local ped = PlayerPedId()
        if IsPedInAnyVehicle(ped, false) then
            local veh = GetVehiclePedIsIn(ped, false)
            SendNUIMessage({
                type    = 'carhud',
                speed   = GetEntitySpeed(veh) * 3.6,          -- km/h
                rpm     = GetVehicleCurrentRpm(veh),          -- 0.0 - 1.0
                gear    = GetVehicleCurrentGear(veh),
                fuel    = GetVehicleFuelLevel(veh),           -- 0 - 100
                engine  = GetVehicleEngineHealth(veh) / 10.0, -- 0 - 100
                seatbelt = seatbeltOn,                        -- kendi kemer state'iniz
            })
        end
        Wait(100)
    end
end)
```

Kullanmayacağınız widget'ın HTML bloğunu silmeniz yeterli; API eksik widget'ları
sessizce atlar.

## Renk paleti

| Değişken | Renk | Kullanım |
|----------|------|----------|
| `--hud-bg` | `#060b1f` | Zemin |
| `--hud-cyan` | `#5ecbff` | Glow halka / progress |
| `--hud-white` | `#e8f2ff` | Rakamlar |
| `--hud-gold` | `#e9c46a` | Vurgu (vites, başlık) |
| `--hud-red` | `#ff5d5d` | Uyarı / redline |

Tüm renkler `css/hud.css` başındaki `:root` bloğundan tek noktadan değiştirilebilir.
