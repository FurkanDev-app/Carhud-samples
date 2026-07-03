# Aero Pair — Jet Compass + Annunciator Strip

Referans fotoğraflardan birebir uyarlanan **2 uçak widget'ı** — bağımsız paket,
repo'daki diğer dosyalara bağımlılığı yoktur. Klasörü olduğu gibi FiveM
resource'unuza kopyalayabilirsiniz.

## Widget'lar

| # | Widget | Açıklama |
|---|--------|----------|
| P01 | **Jet Compass** | Siyah kadran, dönen pusula gülü (N/3/6/E&hellip; havacılık formatı), ortada beyaz jet silüeti, kırmızı hedef işaretçisi (`bug`) |
| P02 | **Annunciator Strip** | MOTOR / IŞIK / YAKIT / VİTES / STALL durum ışıkları — pill LED'ler, konsol fontu |

Işık mantığı: `true` yeşil, `false` sönük, `'red'` kırmızı.
**STALL `true` olduğunda kırmızı yanıp söner.**

## Önizleme

`index.html` dosyasını tarayıcıda açın; demo verisi otomatik oynar.

## Dosyalar

```
index.html         → iki widget'ı barındıran sayfa (NUI sayfanızın temeli)
aero-pair.css      → stiller (renkler :root bloğundan değişir)
aero-pair.js       → kurulum + AeroPair.set() API'si + NUI listener
aero-pair-demo.js  → sahte veri — FiveM'e taşırken SİLİN
```

## FiveM entegrasyonu

```lua
-- fxmanifest.lua
fx_version 'cerulean'
game 'gta5'
ui_page 'index.html'
files { 'index.html', 'aero-pair.css', 'aero-pair.js' }

-- client.lua
CreateThread(function()
    while true do
        local ped = PlayerPedId()
        if IsPedInAnyVehicle(ped, false) then
            local veh = GetVehiclePedIsIn(ped, false)
            SendNUIMessage({
                type  = 'carhud',
                hdg   = 360.0 - GetEntityHeading(veh),          -- pusula yönü
                bug   = 270.0,                                  -- hedef/waypoint yönü
                motor = GetVehicleEngineHealth(veh) > 300,      -- true yeşil
                isik  = GetVehicleLightsState(veh) and true or 'red',
                yakit = GetVehicleFuelLevel(veh) > 15,
                vites = true,                                   -- iniş takımı durumunuz
                stall = false,                                  -- stall uyarınız
            })
        end
        Wait(100)
    end
end)
```

Tek widget kullanacaksanız diğerinin div'ini `index.html`'den silmeniz yeterli;
API eksik widget'ları sessizce atlar. `body` ve `.pair-wrap` stilleri yalnızca
önizleme ortalaması içindir — kendi HUD'unuzda widget div'lerini istediğiniz
köşeye yerleştirin.
