/**
 * "İş bölümü" yapan 3 model. Her rol farklı bir uzmanlık üstlenir.
 * Model kimlikleri ortam değişkenleriyle geçersiz kılınabilir; böylece
 * OpenRouter'da güncel en iyi modellere kolayca geçilebilir.
 *
 * Denetçi (auditor) rolü ileride eklenecek ayrı API için ayrılmıştır.
 */
export const AGENT_MODELS = {
  // 1) Protokol sıralama uzmanı: doğru önem sırasını ve gerekçesini üretir.
  orderer: process.env.MODEL_ORDERER ?? "anthropic/claude-opus-4.8",
  // 2) Redaktör / metin yazarı: profesyonel protokol metnini yazar.
  writer: process.env.MODEL_WRITER ?? "openai/gpt-5.6-terra-pro",
  // 3) Baş editör: iki çıktıyı birleştirir, hataları düzeltir, son metni verir.
  editor: process.env.MODEL_EDITOR ?? "google/gemini-2.5-pro",
};

export const AGENT_ROLES = {
  orderer: "Protokol Sıralama Uzmanı",
  writer: "Redaktör / Metin Yazarı",
  editor: "Baş Editör",
};
