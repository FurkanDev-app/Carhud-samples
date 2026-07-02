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

## Dosya yapısı

```
index.html   → tüm widget'ların vitrini (NUI sayfanızın temeli)
css/hud.css  → tüm widget stilleri (bölüm bölüm ayrılmış, tekini kopyalayıp alabilirsiniz)
js/hud.js    → widget güncelleme API'si (CarHud.setSpeed vb.) + NUI message listener
js/demo.js   → sahte veri animasyonu — FiveM'e taşırken SİLİN
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
