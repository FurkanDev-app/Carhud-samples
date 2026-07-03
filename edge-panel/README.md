# Edge Panel — Bisiklet Bilgisayarı Widget'ı

Referans fotoğraftaki (Garmin Edge) düzenin birebir kopyası — **bağımsız paket**,
repo'daki diğer dosyalara bağımlılığı yoktur. Klasörü olduğu gibi FiveM
resource'unuza kopyalayabilirsiniz.

Düzen: üstte TRAIN (bisiklet ikonu) + Elevation, ortada dev Speed,
altta Heart Rate (atan kırmızı nokta) + Power.

## Önizleme

`index.html` dosyasını tarayıcıda açın; demo verisi otomatik oynar.

## Dosyalar

```
index.html          → widget'ı barındıran sayfa (NUI sayfanızın temeli)
edge-panel.css      → stiller (renkler :root bloğundan değişir)
edge-panel.js       → kurulum + EdgePanel.set() API'si + NUI listener
edge-panel-demo.js  → sahte veri — FiveM'e taşırken SİLİN
```

## FiveM entegrasyonu

```lua
-- fxmanifest.lua
fx_version 'cerulean'
game 'gta5'
ui_page 'index.html'
files { 'index.html', 'edge-panel.css', 'edge-panel.js' }

-- client.lua
CreateThread(function()
    while true do
        local ped = PlayerPedId()
        if IsPedInAnyVehicle(ped, false) then
            local veh = GetVehiclePedIsIn(ped, false)
            SendNUIMessage({
                type  = 'carhud',
                speed = GetEntitySpeed(veh) * 3.6,        -- km/h
                elev  = GetEntityCoords(veh).z * 3.28084, -- feet
                hr    = 128,                              -- roleplay verisi
                power = 165,                              -- roleplay verisi
            })
        end
        Wait(100)
    end
end)
```

`index.html` içindeki `body` stili yalnızca önizleme ortalaması içindir —
kendi HUD'unuzda `.w-edge` div'ini istediğiniz köşeye yerleştirin.
