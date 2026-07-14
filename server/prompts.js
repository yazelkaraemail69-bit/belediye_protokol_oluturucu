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
 * DeepSeek — yapılandırılmış protokol planı üretir (kısa, düşük jeton).
 * Kişiler protokol sırasına göre gelir (1 = en önemli).
 */
export function plannerMessages({ people, event }) {
  return [
    {
      role: "system",
      content:
        "Sen Türkiye belediye protokol planlayıcısısın. Görevin ham veriden " +
        "Instagram paylaşım metni için KISA bir plan çıkarmaktır.\n\n" +
        "Plan şunları içermeli:\n" +
        "- Belediye adı ve olayın özü (1 cümle)\n" +
        "- Kişileri protokol sırasına göre nasıl anacağın (Sayın … unvanıyla)\n" +
        "- Cümle iskeleti önerisi (katılımıyla / katkılarıyla vb.)\n\n" +
        "YASAK: oturma düzeni, konuşma metni, program akışı, tören adımları.\n" +
        "Yalnızca planı yaz; nihai paylaşım metnini YAZMA.",
    },
    {
      role: "user",
      content:
        `Instagram paylaşım metni için plan oluştur.\n\n` +
        `${renderEvent(event)}\n\n` +
        `Protokoldeki kişiler (1 = en önemli):\n${renderPeople(people)}`,
    },
  ];
}

/**
 * Gemini — plana dayanarak nihai Instagram metnini yazar.
 */
export function writerMessages({ people, event, plan }) {
  return [
    {
      role: "system",
      content:
        "Sen belediye sosyal medya editörüsün. Sana bir protokol planı verilir; " +
        "buna sadık kalarak Instagram'da paylaşılacak kısa, akıcı Türkçe metin yazarsın.\n\n" +
        "Kurallar:\n" +
        "- Tek paragraf, 2–4 cümle, en fazla 450 karakter\n" +
        "- Belediye adı, olay ve kişilerin ad-unvanları geçmeli\n" +
        "- Oturma düzeni, karşılama, konuşma metni, program akışı YAZMA\n" +
        "- Doğrudan paylaşım metniyle başla; başlık veya açıklama ekleme\n" +
        "- Cümleyi mutlaka noktalama işaretiyle tamamla",
    },
    {
      role: "user",
      content:
        `${renderEvent(event)}\n\n` +
        `Kişiler:\n${renderPeople(people)}\n\n` +
        `[Protokol planı]\n${plan}\n\n` +
        `Plana sadık kalarak nihai Instagram paylaşım metnini yaz.`,
    },
  ];
}
