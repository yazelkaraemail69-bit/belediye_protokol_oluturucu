/**
 * İki model iş bölümü:
 * - DeepSeek: ucuz + güçlü muhakeme → protokol planı / mention stratejisi
 * - Gemini 2.5 Pro: en iyi Türkçe üslup → nihai Instagram metni
 */
export const AGENT_MODELS = {
  planner: process.env.MODEL_PLANNER ?? "deepseek/deepseek-chat-v3-0324",
  writer: process.env.MODEL_WRITER ?? "google/gemini-2.5-pro",
};

export const AGENT_ROLES = {
  planner: "Protokol Planlayıcı (DeepSeek)",
  writer: "Sosyal Medya Editörü (Gemini)",
};
