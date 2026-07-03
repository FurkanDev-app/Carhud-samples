# EV Arc — Elektrikli Araç Hız Göstergesi

270° turkuaz yay, dijital hız ve anlık kW okuması — **bağımsız paket**,
repo'daki diğer dosyalara bağımlılığı yoktur. Klasörü olduğu gibi FiveM
resource'unuza kopyalayabilirsiniz.

`power` alanı işaretlidir: negatif değer gönderirseniz kW okuması yeşile
dönerek rejeneratif frenlemeyi gösterir.

## Önizleme

`index.html` dosyasını tarayıcıda açın; demo verisi otomatik oynar.

## Dosyalar

```
index.html      → widget'ı barındıran sayfa (NUI sayfanızın temeli)
ev-arc.css      → stiller (renkler :root bloğundan değişir)
ev-arc.js       → kurulum + EvArc.set() API'si + NUI listener
ev-arc-demo.js  → sahte veri — FiveM'e taşırken SİLİN
```

## FiveM entegrasyonu

```lua
-- fxmanifest.lua
fx_version 'cerulean'
game 'gta5'
ui_page 'index.html'
files { 'index.html', 'ev-arc.css', 'ev-arc.js' }

-- client.lua
local prevSpeed = 0.0
CreateThread(function()
    while true do
        local ped = PlayerPedId()
        if IsPedInAnyVehicle(ped, false) then
            local veh = GetVehiclePedIsIn(ped, false)
            local speed = GetEntitySpeed(veh) * 3.6 -- km/h
            -- basit güç tahmini: hızlanma pozitif, yavaşlama rejen
            local power = (speed - prevSpeed) * 25 + speed * 0.3
            prevSpeed = speed
            SendNUIMessage({
                type  = 'carhud',
                speed = speed,
                power = power,
            })
        end
        Wait(100)
    end
end)
```

Gösterge tavanı `ev-arc.js` başındaki `MAX_SPEED` sabitinden (varsayılan 260 km/h)
değiştirilebilir. `index.html` içindeki `body` stili yalnızca önizleme
ortalaması içindir — kendi HUD'unuzda `.w-tarc` div'ini istediğiniz köşeye koyun.
