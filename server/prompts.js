import { PROTOCOL_CONSTITUTION } from "./constitution.js";
import { renderStyleExamples } from "./examples.js";

function renderPeople(people) {
  return people
    .map((p, i) => `${i + 1}. ${p.name} — ${p.title}`)
    .join("\n");
}

function renderEvent(event) {
  const lines = [];
  if (event?.municipality) lines.push(`Belediye: ${event.municipality}`);
  if (event?.name) lines.push(`Olay / etkinlik: ${event.name}`);
  if (event?.date) lines.push(`Tarih: ${event.date}`);
  if (event?.location) lines.push(`Yer: ${event.location}`);
  if (event?.notes) lines.push(`Ek not / program detayı: ${event.notes}`);
  return lines.length ? lines.join("\n") : "Belirtilmedi.";
}

const CONSTITUTION_BLOCK =
  "\n\n" + PROTOCOL_CONSTITUTION + renderStyleExamples();

/**
 * DeepSeek — referans örneklere uygun yapısal plan çıkarır.
 */
export function plannerMessages({ people, event }) {
  return [
    {
      role: "system",
      content:
        "Sen Türkiye belediyesi Instagram metin planlayıcısısın. Ham veriden, " +
        "referans örneklerdeki formata uygun bir YAZIM PLANI çıkarırsın.\n\n" +
        "Plan şunları içermeli:\n" +
        "- Manşet başlık önerisi (tavsanlibelediye satırı için)\n" +
        "- Giriş paragrafı: kim, ne yaptı, nerede\n" +
        "- Gövde paragrafları: görüşme/program/inceleme detayları\n" +
        "- Protokol katılımcıları paragrafı (virgülle ayrılmış unvan+isim listesi)\n" +
        "- Kapanış vurgusu (varsa)\n\n" +
        "Yalnızca planı yaz; nihai metni YAZMA." +
        CONSTITUTION_BLOCK,
    },
    {
      role: "user",
      content:
        `Referans örneklere uygun Instagram metni planı oluştur.\n\n` +
        `${renderEvent(event)}\n\n` +
        `Protokoldeki kişiler (1 = en önemli):\n${renderPeople(people)}`,
    },
  ];
}

/**
 * Gemini — plan ve referans örneklere göre nihai belediye Instagram metnini yazar.
 */
export function writerMessages({ people, event, plan }) {
  return [
    {
      role: "system",
      content:
        "Sen belediye Instagram metin editörüsün. Sana bir yazım planı verilir; " +
        "referans örneklerin üslubunda, resmi belediye haber diliyle nihai metni yazarsın.\n\n" +
        "Kurallar:\n" +
        "- Metin tavsanlibelediye öneki ve manşetle başlar\n" +
        "- Referans örneklerle aynı paragraf yapısı ve ton\n" +
        "- Uzunluk sınırı yok; gerekli detayı yaz\n" +
        "- Yalnızca nihai metni döndür" +
        CONSTITUTION_BLOCK,
    },
    {
      role: "user",
      content:
        `${renderEvent(event)}\n\n` +
        `Kişiler (protokol sırası, 1 = en önemli):\n${renderPeople(people)}\n\n` +
        `[Yazım planı]\n${plan}\n\n` +
        `Plana ve referans örneklere sadık kalarak nihai Instagram metnini yaz.`,
    },
  ];
}
