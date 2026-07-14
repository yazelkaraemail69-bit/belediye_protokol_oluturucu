import dotenv from "dotenv";

dotenv.config();

/**
 * Sunucu yapılandırması. Gizli anahtar SADECE burada, sunucu tarafında okunur;
 * tarayıcıya asla gönderilmez.
 */
export const config = {
  port: Number(process.env.PORT ?? 8787),
  openRouterApiKey: process.env.OPENROUTER_API_KEY ?? "",
  openRouterBaseUrl:
    process.env.OPENROUTER_BASE_URL ?? "https://openrouter.ai/api/v1",
  // OpenRouter, sıralama/analiz için isteğe bağlı başlıklar önerir.
  referer: process.env.OPENROUTER_REFERER ?? "http://localhost:5173",
  appTitle: process.env.OPENROUTER_APP_TITLE ?? "Belediye Protokol Oluşturucu",
};

export function hasApiKey() {
  return Boolean(config.openRouterApiKey);
}
