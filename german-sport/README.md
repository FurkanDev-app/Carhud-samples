# German Sport — Analog Hız Göstergesi

Alman spor otomobili tarzı ibreli hız göstergesi: simsiyah kadran, ince DIN
tipi beyaz rakamlar, ince kırmızı ibre ve **çalışan odometre penceresi**.
0-280 km/h skala. **Bağımsız paket** — repo'daki diğer dosyalara bağımlılığı
yoktur; klasörü olduğu gibi FiveM resource'unuza kopyalayabilirsiniz.

## Önizleme

`index.html` dosyasını tarayıcıda açın; demo verisi otomatik oynar.

## Dosyalar

```
index.html            → widget'ı barındıran sayfa (NUI sayfanızın temeli)
german-sport.css      → stiller (renkler :root bloğundan değişir)
german-sport.js       → kurulum + GermanDial.set() API'si + NUI listener
german-sport-demo.js  → sahte veri — FiveM'e taşırken SİLİN
```

## FiveM entegrasyonu

```lua
-- fxmanifest.lua
fx_version 'cerulean'
game 'gta5'
ui_page 'index.html'
files { 'index.html', 'german-sport.css', 'german-sport.js' }

-- client.lua
CreateThread(function()
    while true do
        local ped = PlayerPedId()
        if IsPedInAnyVehicle(ped, false) then
            local veh = GetVehiclePedIsIn(ped, false)
            SendNUIMessage({
                type  = 'carhud',
                speed = GetEntitySpeed(veh) * 3.6, -- km/h
                odo   = 42137,                     -- kendi km kaydınız (isteğe bağlı)
            })
        end
        Wait(100)
    end
end)
```

`odo` alanı isteğe bağlıdır; gönderilmezse pencere 000 000 kalır.
`index.html` içindeki `body` stili yalnızca önizleme ortalaması içindir —
kendi HUD'unuzda `.w-german` div'ini istediğiniz köşeye yerleştirin.
