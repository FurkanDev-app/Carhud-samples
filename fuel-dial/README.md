# Fuel Dial — Uçak Yakıt Göstergesi

Klasik havacılık yakıt saati: **tek kadran, tek ibre**, E &ndash; 1/2 &ndash; F skalası.
**Bağımsız paket** — repo'daki diğer dosyalara bağımlılığı yoktur; klasörü
olduğu gibi FiveM resource'unuza kopyalayabilirsiniz.

Yakıt %15'in altına düşünce FUEL etiketi amber renkte yanıp söner.

## Önizleme

`index.html` dosyasını tarayıcıda açın; demo verisi otomatik oynar.

## Dosyalar

```
index.html         → widget'ı barındıran sayfa (NUI sayfanızın temeli)
fuel-dial.css      → stiller (renkler :root bloğundan değişir)
fuel-dial.js       → kurulum + FuelDial.set() API'si + NUI listener
fuel-dial-demo.js  → sahte veri — FiveM'e taşırken SİLİN
```

## FiveM entegrasyonu

```lua
-- fxmanifest.lua
fx_version 'cerulean'
game 'gta5'
ui_page 'index.html'
files { 'index.html', 'fuel-dial.css', 'fuel-dial.js' }

-- client.lua
CreateThread(function()
    while true do
        local ped = PlayerPedId()
        if IsPedInAnyVehicle(ped, false) then
            local veh = GetVehiclePedIsIn(ped, false)
            SendNUIMessage({
                type = 'carhud',
                fuel = GetVehicleFuelLevel(veh), -- 0-100
            })
        end
        Wait(200)
    end
end)
```

`index.html` içindeki `body` stili yalnızca önizleme ortalaması içindir —
kendi HUD'unuzda `.w-fdial` div'ini istediğiniz köşeye yerleştirin.
