/**
 * Instagram paylaşım metni için tek model.
 * Ortam değişkeni MODEL_WRITER ile geçersiz kılınabilir.
 */
export const AGENT_MODELS = {
  writer: process.env.MODEL_WRITER ?? "google/gemini-2.5-flash",
};

export const AGENT_ROLES = {
  writer: "Sosyal Medya Editörü",
};
