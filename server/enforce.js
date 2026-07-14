import {
  FORBIDDEN_PATTERNS,
  MAX_OUTPUT_CHARS,
  PROTOCOL_CONSTITUTION,
} from "./constitution.js";

/**
 * Model çıktısını anayasaya göre denetler ve gerekirse sadeleştirir.
 *
 * @param {string} text
 * @returns {{ text: string, ok: boolean, violations: string[] }}
 */
export function enforceConstitution(text) {
  let cleaned = String(text ?? "")
    .trim()
    .replace(/^["'`]+|["'`]+$/g, "")
    .replace(/^(İşte|Paylaşım metni|Metin)\s*:?\s*/i, "");

  const violations = [];

  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(cleaned)) {
      violations.push(`Yasak kalıp: ${pattern.source}`);
    }
  }

  if (cleaned.length > MAX_OUTPUT_CHARS) {
    violations.push(`Metin çok uzun (${cleaned.length} karakter)`);
    cleaned = truncateToSentences(cleaned, MAX_OUTPUT_CHARS);
  }

  const lineCount = cleaned.split("\n").filter((l) => l.trim()).length;
  if (lineCount > 2) {
    violations.push("Birden fazla paragraf veya liste algılandı");
    cleaned = cleaned.split("\n").filter((l) => l.trim())[0] ?? cleaned;
  }

  return {
    text: cleaned.trim(),
    ok: violations.length === 0,
    violations,
  };
}

/** Anayasa ihlali sonrası yeniden deneme istemi. */
export function retryMessages({ people, event, previousOutput, violations }) {
  return [
    {
      role: "system",
      content:
        "Sen belediye sosyal medya editörüsün. Ana yasaya KESİNLİKLE uy.\n\n" +
        PROTOCOL_CONSTITUTION,
    },
    {
      role: "user",
      content:
        `Önceki çıktın anayasaya aykırıydı. Yeniden yaz.\n\n` +
        `İhlaller: ${violations.join("; ")}\n\n` +
        `Yanlış çıktı:\n${previousOutput}\n\n` +
        `Doğru format: tek paragraf, en fazla 450 karakter, yalnızca Instagram paylaşım metni.`,
    },
  ];
}

function truncateToSentences(text, maxLen) {
  const sentences = text.match(/[^.!?]+[.!?]+/g) ?? [text];
  let out = "";
  for (const s of sentences) {
    if ((out + s).length > maxLen) break;
    out += s;
  }
  return out.trim() || text.slice(0, maxLen).trim();
}
