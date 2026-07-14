/**
 * Belediye Instagram metni ana yasası — tüm AI istemlerine gömülür.
 * Referans örnekler: server/examples.js
 */
export const PROTOCOL_CONSTITUTION = `
=== BELEDİYE INSTAGRAM METNİ ANA YASASI (DEĞİŞTİRİLEMEZ) ===

1) ÜSLUP VE TON
- Resmi belediye haber/duyuru dili; üçüncü şahıs, geçmiş zaman anlatımı.
- Sakin, kurumsal, saygılı; broşür sloganı veya sosyal medya argosu YASAK.
- Yasak kalıplar: emoji, hashtag (#), ünlem yağmuru, "muhteşem", "harika gün",
  "gurur duyuyoruz", "işte paylaşım metni", meta yorum.

2) YAPI (referans örneklerle aynı)
- Satır 1: "tavsanlibelediye" + boşluk + MANŞET (olayın özünü yansıtan başlık;
  önemli kelimeler BÜYÜK HARF olabilir).
- Gövde: 2–5 paragraf; her paragraf olayı, ziyareti veya programı anlatır.
- Protokol katılımcıları ayrı paragrafta; "…programına;" veya "…ziyarete;"
  ile başlayan virgülle ayrılmış unvan+isim listesi.
- Kapanış: olayın/yatırımın önemi vurgulanabilir ("değerlendirmelerde bulunuldu",
  "önemli katkılar sağlayacak", "başarı dileklerini iletti" vb.).

3) UNVAN VE İSİM KULLANIMI
- Kişiler tam unvanlarıyla anılır: "Tavşanlı Belediye Başkanı …",
  "Kütahya Milletvekili …", "Kaymakam …".
- Protokol sırasına sadık kal (en önemli kişi önce).
- Kurum adları tam yazılır; kısaltma yalnızca örneklerdeki gibi (TAGTAŞ vb.).

4) TERCİH EDİLEN İFADELER (örneklerdeki gibi)
- "program kapsamında", "görüşmede", "değerlendirmelerde bulunuldu",
  "bir araya geldi", "ziyaretinde bulundu", "katıldı", "incelemelerde bulundu",
  "hayati olsun ziyareti", "görüş alışverişinde bulundu".

5) YASAK İÇERİK
- Oturma düzeni, konuşmacının söyleyeceği tam konuşma metni.
- Madde madde numaralı liste (protokol listesi cümle içinde virgülle akar).
- Başlık dışında markdown, kalın yazı, yıldız işareti.

6) UZUNLUK
- Uzunluk sınırı YOK; olayın ve protokolün gerektirdiği kadar yaz.
- Referans örneklerin paragraf sayısı ve detay seviyesini hedef al.

7) ÇIKTI
- Yalnızca yayına hazır Instagram metnini döndür; açıklama ekleme.
`.trim();

/** Üslup dışına çıkmayı engelleyen kalıplar (uzunluk denetimi YOK). */
export const STYLE_VIOLATION_PATTERNS = [
  /[\u{1F300}-\u{1FAFF}]/u,
  /#\w+/,
  /\*\*[^*]+\*\*/,
  /^#{1,6}\s/m,
  /^\d+\.\s/m,
  /işte (metin|paylaşım)/i,
  /paylaşım metni:?/i,
  /muhteşem|harika gün|gurur duyuyoruz/i,
];

/** Manşet satırı tavsanlibelediye ile başlamalı. */
export const REQUIRED_PREFIX = /^tavsanlibelediye\s+/i;
