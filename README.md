# CarHUD Samples — Seçilen Tasarımlar

FiveM HUD script'leri için seçilen 7 widget'ın **bağımsız, taşımaya hazır** paketi.
Repo'yu olduğu gibi FiveM resource'unuza kopyalayabilirsiniz.

## İçerik

| Widget | Tür | Veri alanı |
|--------|-----|-----------|
| **Classic Gauge** (ice tema) | Araç — hız | `speed` (km/h) |
| **A1 — Horizon** (yarım yay) | Araç — hız | `speed` (km/h) |
| **S01 — Dash Arc** (segmentli yay) | Araç — hız | `speed` (km/h) |
| **S02 — Wings** (çift kanat yay) | Araç — hız | `speed` (km/h) |
| **F01 — Altimeter** (çift ibreli) | Uçak | `alt` (feet) |
| **F02 — Attitude** (suni ufuk) | Uçak | `pitch`, `roll` (derece) |
| **F05 — Turn Coordinator** | Uçak | `roll`, `slip` (-1..1) |

## Önizleme

`index.html` dosyasını tarayıcıda açın; demo verisi otomatik oynar.

## Dosyalar

```
index.html        → 7 widget'ın vitrini (NUI sayfanızın temeli)
selected.css      → tüm stiller (widget başına bölümlenmiş)
selected.js       → widget kurulumu + SelectedHud.set() API'si + NUI listener
selected-demo.js  → sahte veri — FiveM'e taşırken SİLİN
```

## FiveM entegrasyonu

```lua
-- fxmanifest.lua
fx_version 'cerulean'
game 'gta5'
ui_page 'index.html'
files { 'index.html', 'selected.css', 'selected.js' }

-- client.lua
CreateThread(function()
    while true do
        local ped = PlayerPedId()
        if IsPedInAnyVehicle(ped, false) then
            local veh = GetVehiclePedIsIn(ped, false)
            SendNUIMessage({
                type  = 'carhud',
                speed = GetEntitySpeed(veh) * 3.6,             -- km/h
                -- uçaklar için ek alanlar:
                alt   = GetEntityCoords(veh).z * 3.28084,      -- feet
                pitch = GetEntityPitch(veh),
                roll  = GetEntityRoll(veh),
                slip  = 0.0,                                   -- kendi hesabınız
            })
        end
        Wait(100)
    end
end)
```

Kullanmayacağınız widget'ın HTML bloğunu `index.html`'den silmeniz yeterli;
API eksik widget'ları sessizce atlar. Vitrin düzeni (başlık, grid) yalnızca
önizleme içindir — kendi HUD'unuzda widget div'lerini istediğiniz yere koyun.

## Renk paleti

Tüm renkler `selected.css` başındaki `:root` bloğundan tek noktadan değiştirilebilir
(`--hud-cyan`, `--hud-gold`, `--hud-red` vb.).

> Not: Bu oturumda üretilen diğer tüm galeriler (15 hız göstergesi, 15 uçak hız
> ölçeri, 15'li kokpit seti, tema varyantları) git geçmişinde durmaktadır —
> `632bfd4` commit'inde tamamı mevcuttur.
