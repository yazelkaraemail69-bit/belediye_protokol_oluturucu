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
- **AI ile protokol metni** – en iyi 3 yapay zeka iş bölümü yaparak
  (sıralama uzmanı → redaktör → baş editör) profesyonel protokol belgesi
  üretir. OpenRouter anahtarı **yalnızca backend proxy'de** tutulur,
  tarayıcıya asla gönderilmez.

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
| `config.js` | ortam değişkenleri; anahtar yalnızca burada okunur |
| `models.js` | iş bölümü yapan 3 model kimliği (env ile değiştirilebilir) |
| `prompts.js` | 3 rol için istemler; `examples` ile few-shot desteğine hazır |
| `openrouter.js` | OpenRouter istemcisi (chat + model listesi) |
| `pipeline.js` | 3 aşamalı üretim hattı |
| `index.js` | `GET /api/health`, `POST /api/protocol/generate` |

**İleride:** Denetçi (auditor) API'si ayrı bir rol/adaptör olarak; kapsamlı
protokol örnekleri ise `examples` alanı üzerinden few-shot/RAG olarak
eklenebilir (kancalar hazır bırakılmıştır).
