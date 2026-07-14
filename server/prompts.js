import { PROTOCOL_CONSTITUTION } from "./constitution.js";

function renderPeople(people) {
  return people
    .map((p, i) => `${i + 1}. ${p.name} — ${p.title}`)
    .join("\n");
}

function renderEvent(event) {
  const lines = [];
  if (event?.municipality) lines.push(`Belediye: ${event.municipality}`);
  if (event?.name) lines.push(`Olay / hizmet: ${event.name}`);
  if (event?.date) lines.push(`Tarih: ${event.date}`);
  if (event?.location) lines.push(`Yer: ${event.location}`);
  if (event?.notes) lines.push(`Ek not: ${event.notes}`);
  return lines.length ? lines.join("\n") : "Belirtilmedi.";
}

/**
 * Tek aşamalı Instagram paylaşım metni istemi.
 * Kişiler zaten protokol sırasına göre gelir (istemci tarafında sıralanmış).
 */
export function socialPostMessages({ people, event }) {
  return [
    {
      role: "system",
      content:
        "Sen belediye sosyal medya editörüsün. Görevin yalnızca Instagram'da " +
        "paylaşılacak kısa bir metin yazmaktır.\n\n" +
        PROTOCOL_CONSTITUTION,
    },
    {
      role: "user",
      content:
        `Aşağıdaki bilgilerle Instagram paylaşım metni yaz.\n\n` +
        `${renderEvent(event)}\n\n` +
        `Protokolde adı geçen kişiler (1 = en önemli):\n${renderPeople(people)}\n\n` +
        `Yalnızca paylaşım metnini döndür. Başka açıklama ekleme.`,
    },
  ];
}
