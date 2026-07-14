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
- **AI ile Instagram metni** – DeepSeek yazım planını çıkarır, Gemini 2.5 Pro
  referans örneklere uygun resmi belediye metnini yazar. **Ana yasa**
  (`server/constitution.js`) ve **örnek metinler** (`server/examples.js`)
  üslup dışına çıkmayı engeller.

## Geliştirme

Node 22 gerektirir (`.nvmrc`).

```bash
nvm use          # veya: nvm use 22
npm install
cp .env.example .env   # OPENROUTER_API_KEY değerini girin
npm run dev      # web (5173) + api (8787) birlikte
npm run dev:web  # sadece frontend
npm run server   # sadece backend proxy
npm run build    # tsc + üretim derlemesi
npm run lint     # oxlint
```

Gizli anahtar `.env` içinde tutulur ve depoya gönderilmez (`.gitignore`).
Örnek için `.env.example` dosyasına bakın.

## Mimari

| Katman | Konum | Not |
| --- | --- | --- |
| Tipler | `src/types.ts` | `Person`, `ProtocolPosition` |
| Protokol verisi | `src/data/protocolPositions.ts` | mevki + önem derecesi (`rank`) |
| Sıralama mantığı | `src/utils/protocolOrder.ts` | `sortByProtocol`, `insertByRank` |
| Servisler | `src/services/*` | `authService`, `personRepository` (API'ye hazır arayüz) |
| Arayüz | `src/components/*` | `Login`, `ProtocolApp`, `PersonForm`, `ProtocolOrderPanel`, `ProtocolTextPanel` |
| AI servisi | `src/services/protocolAiService.ts` | yalnızca yerel `/api` proxy'sini çağırır |
| Backend proxy | `server/*` | OpenRouter çağrıları; anahtar sunucuda kalır |

### Backend (`server/`)

| Dosya | Not |
| --- | --- |
| `constitution.js` | **Ana yasa** — referans üslup kuralları (uzunluk sınırı yok) |
| `examples.js` | Tavşanlı Belediyesi referans Instagram metinleri (few-shot) |
| `enforce.js` | Üslup denetimi; ihlalde yeniden deneme |
| `config.js` | ortam değişkenleri |
| `models.js` | DeepSeek (planlayıcı) + Gemini 2.5 Pro (yazar) |
| `prompts.js` | anayasa + örneklerle gömülü istemler |
| `pipeline.js` | 2 aşamalı üretim hattı |
