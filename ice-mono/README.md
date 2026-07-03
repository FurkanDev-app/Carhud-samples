# Ice Mono — NFS Tarzı Monokrom Takometre

NFS kümesi referanslı monokrom analog takometre: gri segmentli bant, banda
paralel 0-10 rakamları, **buz mavisi redline**, halka göbekli ince beyaz ibre,
iç kesik yaylar ve bandın alt boşluğuna hizalı **dijital MPH okuması**.
**Bağımsız paket** — repo'daki diğer dosyalara bağımlılığı yoktur.

İbre devri (rpm), dijital pencere hızı gösterir; iç yay gaz pedalını izler.

## Önizleme

`index.html` dosyasını tarayıcıda açın; demo verisi otomatik oynar.

## Dosyalar

```
index.html        → widget'ı barındıran sayfa (NUI sayfanızın temeli)
ice-mono.css      → stiller
ice-mono.js       → kurulum + IceMono.set() API'si + NUI listener
ice-mono-demo.js  → sahte veri — FiveM'e taşırken SİLİN
```

## FiveM entegrasyonu

```lua
-- fxmanifest.lua
fx_version 'cerulean'
game 'gta5'
ui_page 'index.html'
files { 'index.html', 'ice-mono.css', 'ice-mono.js' }

-- client.lua
CreateThread(function()
    while true do
        local ped = PlayerPedId()
        if IsPedInAnyVehicle(ped, false) then
            local veh = GetVehiclePedIsIn(ped, false)
            SendNUIMessage({
                type     = 'carhud',
                speed    = GetEntitySpeed(veh) * 3.6,   -- km/h (kadran MPH'e çevirir)
                rpm      = GetVehicleCurrentRpm(veh),   -- 0-1
                throttle = 0.0,                          -- isteğe bağlı iç yay
            })
        end
        Wait(100)
    end
end)
```

- Vurgu rengi: `ice-mono.js` başındaki `ACCENT` sabiti (varsayılan `#4db8ff`).
- KM/H göstermek isterseniz `ice-mono.js` içindeki `0.621371` çarpanını `1`
  yapıp CSS'te MPH etiketini değiştirin.
