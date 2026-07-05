# Side Pill — Mini Analog + Dijital Kapsül

Modern ve sade FiveM göstergesi: yarı saydam kapsül içinde **mini analog kadran**
(ince ibre) ve yanında **dijital hız + vites**. Ekranda çok az yer kaplar.
**Bağımsız paket** — repo'daki diğer dosyalara bağımlılığı yoktur.

## Önizleme

`index.html` dosyasını tarayıcıda açın; demo verisi otomatik oynar.

## Dosyalar

```
index.html         → widget'ı barındıran sayfa (NUI sayfanızın temeli)
side-pill.css      → stiller (vurgu rengi :root içindeki --acc)
side-pill.js       → kurulum + SidePill.set() API'si + NUI listener
side-pill-demo.js  → sahte veri — FiveM'e taşırken SİLİN
```

## FiveM entegrasyonu

```lua
-- fxmanifest.lua
fx_version 'cerulean'
game 'gta5'
ui_page 'index.html'
files { 'index.html', 'side-pill.css', 'side-pill.js' }

-- client.lua
CreateThread(function()
    while true do
        local ped = PlayerPedId()
        if IsPedInAnyVehicle(ped, false) then
            local veh = GetVehiclePedIsIn(ped, false)
            SendNUIMessage({
                type  = 'carhud',
                speed = GetEntitySpeed(veh) * 3.6,   -- km/h
                gear  = GetVehicleCurrentGear(veh),
            })
        end
        Wait(100)
    end
end)
```

- Vurgu rengi: `side-pill.css` başındaki `--acc` değişkeni (varsayılan `#4dabff`).
- Kadran tavanı: `side-pill.js` başındaki `MAX` sabiti (varsayılan 260 km/h).
- `body` stili yalnızca önizleme ortalaması içindir — kendi HUD'unuzda
  `.w-sidepill` div'ini istediğiniz köşeye yerleştirin.
