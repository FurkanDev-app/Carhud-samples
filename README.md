# CarHUD Samples

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

## Dosya yapısı

```
index.html            → 6 farklı widget tipinin vitrini
classic-themes.html   → Classic Gauge tema varyantları vitrini
css/hud.css           → widget vitrini stilleri
css/classic-gauge.css → Classic Gauge çekirdek stil + 6 tema
js/hud.js             → vitrin widget API'si (CarHud.setSpeed vb.) + NUI listener
js/classic-gauge.js   → Classic Gauge bileşeni (createClassicGauge) + NUI listener
js/demo.js            → index.html sahte veri animasyonu — FiveM'e taşırken SİLİN
js/classic-demo.js    → classic-themes.html sahte veri animasyonu — FiveM'e taşırken SİLİN
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
