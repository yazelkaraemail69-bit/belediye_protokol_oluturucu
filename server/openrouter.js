import { config } from "./config.js";

/**
 * OpenRouter sohbet tamamlama çağrısı. Anahtar sunucu tarafında kalır.
 *
 * @param {string} model - OpenRouter model kimliği (ör. "openai/gpt-4o").
 * @param {Array<{role: string, content: string}>} messages
 * @param {{ temperature?: number, maxTokens?: number, signal?: AbortSignal }} [opts]
 * @returns {Promise<string>} Modelin ürettiği metin.
 */
export async function callModel(model, messages, opts = {}) {
  if (!config.openRouterApiKey) {
    throw new ApiKeyMissingError();
  }

  const res = await fetch(`${config.openRouterBaseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.openRouterApiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": asciiHeader(config.referer),
      "X-Title": asciiHeader(config.appTitle),
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: opts.temperature ?? 0.4,
      max_tokens: opts.maxTokens ?? 4000,
    }),
    signal: opts.signal,
  });

  if (!res.ok) {
    const detail = await safeReadError(res);
    throw new OpenRouterError(model, res.status, detail);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== "string" || content.trim() === "") {
    throw new OpenRouterError(model, res.status, "Boş yanıt döndü.");
  }
  return content;
}

/**
 * OpenRouter'daki mevcut modelleri getirir (model seçimini doğrulamak için).
 * @returns {Promise<Array<{ id: string }>>}
 */
export async function listModels() {
  const res = await fetch(`${config.openRouterBaseUrl}/models`, {
    headers: { Authorization: `Bearer ${config.openRouterApiKey}` },
  });
  if (!res.ok) {
    throw new OpenRouterError("models", res.status, await safeReadError(res));
  }
  const data = await res.json();
  return Array.isArray(data?.data) ? data.data : [];
}

/** HTTP başlıkları latin1 (ByteString) olmalı; ASCII dışı karakterleri temizler. */
function asciiHeader(value) {
  // eslint-disable-next-line no-control-regex
  return String(value).replace(/[^\x00-\x7F]/g, "");
}

async function safeReadError(res) {
  try {
    const body = await res.json();
    return body?.error?.message ?? JSON.stringify(body);
  } catch {
    return res.statusText;
  }
}

export class ApiKeyMissingError extends Error {
  constructor() {
    super("OPENROUTER_API_KEY tanımlı değil.");
    this.name = "ApiKeyMissingError";
    this.code = "API_KEY_MISSING";
  }
}

export class OpenRouterError extends Error {
  constructor(model, status, detail) {
    super(`OpenRouter hatası (${model}, HTTP ${status}): ${detail}`);
    this.name = "OpenRouterError";
    this.code = "OPENROUTER_ERROR";
    this.status = status;
    this.model = model;
  }
}
