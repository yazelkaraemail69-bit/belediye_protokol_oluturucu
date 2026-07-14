/**
 * Üç ajanın istem (prompt) şablonları. Ajanlar bir iş hattı oluşturur:
 *   1) Sıralama Uzmanı  → doğru protokol sırası + gerekçe
 *   2) Redaktör         → sıralamaya dayalı profesyonel protokol metni
 *   3) Baş Editör       → iki çıktıyı birleştirip nihai belgeyi üretir
 *
 * `examples` alanı, ileride kullanıcının vereceği kapsamlı protokol
 * örnekleriyle (few-shot) beslenecek biçimde şimdiden bırakılmıştır.
 */

function renderPeople(people) {
  return people
    .map((p, i) => `${i + 1}. ${p.name} — ${p.title}`)
    .join("\n");
}

function renderEvent(event) {
  const lines = [];
  if (event?.name) lines.push(`Etkinlik: ${event.name}`);
  if (event?.date) lines.push(`Tarih: ${event.date}`);
  if (event?.location) lines.push(`Yer: ${event.location}`);
  if (event?.notes) lines.push(`Ek notlar: ${event.notes}`);
  return lines.length ? lines.join("\n") : "Belirtilmedi.";
}

function renderExamples(examples) {
  if (!Array.isArray(examples) || examples.length === 0) return "";
  const blocks = examples
    .map((ex, i) => `--- ÖRNEK ${i + 1} ---\n${ex}`)
    .join("\n\n");
  return `\n\nReferans örnekler (aynı üslup ve düzeni benimse):\n${blocks}`;
}

export function ordererMessages({ people, event, examples }) {
  return [
    {
      role: "system",
      content:
        "Sen Türkiye kamu/belediye etkinliklerinde uzman bir PROTOKOL SIRALAMA " +
        "UZMANISIN. Görevin, verilen kişileri Türkiye Devlet Protokol Hizmetleri " +
        "kurallarına göre en önemliden en önemsize doğru sıralamak ve her sıra " +
        "için kısa gerekçe yazmaktır. Sadece sıralama ve gerekçeye odaklan; " +
        "protokol metni YAZMA.",
    },
    {
      role: "user",
      content:
        `Aşağıdaki davetlileri protokol önem sırasına göre (1 = en önemli) sırala.\n\n` +
        `${renderEvent(event)}\n\nDavetliler:\n${renderPeople(people)}` +
        `${renderExamples(examples)}\n\n` +
        "Çıktı formatı:\n" +
        "SIRALAMA:\n1. Ad Soyad — Unvan — (kısa gerekçe)\n2. ...\n\n" +
        "NOTLAR: Sıralamayı etkileyen özel durumlar veya belirsizlikler.",
    },
  ];
}

export function writerMessages({ event, ordering, examples }) {
  return [
    {
      role: "system",
      content:
        "Sen kurumsal ve resmi dilde yazan bir PROTOKOL REDAKTÖRÜSÜN. Sana verilen " +
        "protokol sıralamasını kullanarak profesyonel, tören/etkinlik için " +
        "kullanılabilir bir PROTOKOL METNİ yazarsın. Metin; protokol listesi, " +
        "karşılama/oturma düzeni önerisi, konuşma sırası ve kısa program akışını " +
        "içermelidir. Sıralamayı DEĞİŞTİRME.",
    },
    {
      role: "user",
      content:
        `${renderEvent(event)}\n\nProtokol sıralaması:\n${ordering}` +
        `${renderExamples(examples)}\n\n` +
        "Bu sıralamaya sadık kalarak resmi bir protokol metni oluştur.",
    },
  ];
}

export function editorMessages({ event, ordering, draft, examples }) {
  return [
    {
      role: "system",
      content:
        "Sen deneyimli bir BAŞ EDİTÖRSÜN. Sıralama uzmanının çıktısı ile " +
        "redaktörün metnini birlikte değerlendirir; tutarsızlıkları giderir, " +
        "protokol hatalarını düzeltir, dili resmî ve akıcı hale getirir ve " +
        "yayına hazır NİHAİ protokol belgesini üretirsin. Nihai belge tek başına " +
        "eksiksiz ve kullanılabilir olmalıdır. Cevabına meta yorum, giriş cümlesi " +
        "veya 'işte belge' benzeri ifadelerle BAŞLAMA; doğrudan belgenin kendisiyle başla.",
    },
    {
      role: "user",
      content:
        `${renderEvent(event)}\n\n` +
        `[Sıralama Uzmanı çıktısı]\n${ordering}\n\n` +
        `[Redaktör metni]\n${draft}` +
        `${renderExamples(examples)}\n\n` +
        "Bu iki girdiyi birleştirip düzelterek nihai protokol belgesini yaz. " +
        "Yalnızca nihai belgeyi döndür.",
    },
  ];
}
