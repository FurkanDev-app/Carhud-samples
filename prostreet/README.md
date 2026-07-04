# ProStreet — Açık Kadranlı Takometre

Yarış oyunu tarzı gerçekçi takometre: açık gri kadran, siyah 0-9 rakamları,
kırmızı ibre ve kırmızı bölge, redline'da yanıp sönen **SHIFT ışığı**,
yeşil **LCD hız penceresi** ve vites göstergesi.
**Bağımsız paket** — repo'daki diğer dosyalara bağımlılığı yoktur.

## Önizleme

`index.html` dosyasını tarayıcıda açın; demo verisi otomatik oynar.

## Dosyalar

```
index.html         → widget'ı barındıran sayfa (NUI sayfanızın temeli)
prostreet.css      → stiller
prostreet.js       → kurulum + ProStreet.set() API'si + NUI listener
prostreet-demo.js  → sahte veri — FiveM'e taşırken SİLİN
```

## FiveM entegrasyonu

```lua
-- fxmanifest.lua
fx_version 'cerulean'
game 'gta5'
ui_page 'index.html'
files { 'index.html', 'prostreet.css', 'prostreet.js' }

-- client.lua
CreateThread(function()
    while true do
        local ped = PlayerPedId()
        if IsPedInAnyVehicle(ped, false) then
            local veh = GetVehiclePedIsIn(ped, false)
            SendNUIMessage({
                type  = 'carhud',
                speed = GetEntitySpeed(veh) * 3.6, -- km/h (LCD'de gösterilir)
                rpm   = GetVehicleCurrentRpm(veh), -- 0-1 (ibre + SHIFT ışığı)
                gear  = GetVehicleCurrentGear(veh),
            })
        end
        Wait(100)
    end
end)
```

SHIFT ışığı devir %85'i geçince yanıp söner; eşik `prostreet.js` içindeki
`0.85` değerinden değiştirilebilir.
