# Belediye Protokol Oluşturucu

Belediye çalışanlarının davetlileri **protokol önem sırasına** göre
düzenlemesini sağlayan müşteri paneli modülü.

## Özellikler

- **Giriş paneli** – müşteri (belediye çalışanı) girişi (demo: `belediye` / `1234`).
- **Kişi ekleme** – ad soyad girişi ve mevki/unvan seçimi (hazır Türkiye
  devlet protokol listesi).
- **Otomatik sıralama** – kişiler mevki önemine göre dizilir: en önemli en
  **altta**, en önemsiz en **üstte**.
- **Manuel düzenleme** – sürükle-bırak ile sıra elle değiştirilebilir.
- Veriler şu an tarayıcıda (localStorage) saklanır; kod, sonradan API
  bağlanacak şekilde servis katmanına ayrılmıştır (`src/services`).

## Geliştirme

Node 22 gerektirir (`.nvmrc`).

```bash
nvm use          # veya: nvm use 22
npm install
npm run dev      # geliştirme sunucusu
npm run build    # tsc + üretim derlemesi
npm run lint     # oxlint
```

## Mimari

| Katman | Konum | Not |
| --- | --- | --- |
| Tipler | `src/types.ts` | `Person`, `ProtocolPosition` |
| Protokol verisi | `src/data/protocolPositions.ts` | mevki + önem derecesi (`rank`) |
| Sıralama mantığı | `src/utils/protocolOrder.ts` | `sortByProtocol`, `insertByRank` |
| Servisler | `src/services/*` | `authService`, `personRepository` (API'ye hazır arayüz) |
| Arayüz | `src/components/*` | `Login`, `ProtocolApp`, `PersonForm`, `ProtocolOrderPanel` |
