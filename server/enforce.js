import {
  PROTOCOL_CONSTITUTION,
  REQUIRED_PREFIX,
  STYLE_VIOLATION_PATTERNS,
} from "./constitution.js";

/**
 * Çıktının anayasa ve referans üslubuna uygunluğunu denetler.
 * Uzunluk kısıtlaması uygulanmaz.
 *
 * @param {string} text
 * @returns {{ text: string, ok: boolean, violations: string[] }}
 */
export function enforceConstitution(text) {
  let cleaned = String(text ?? "").trim();
  const violations = [];

  if (!REQUIRED_PREFIX.test(cleaned)) {
    violations.push('Metin "tavsanlibelediye" öneki ile başlamalı');
    if (!cleaned.toLowerCase().startsWith("tavsanlibelediye")) {
      cleaned = `tavsanlibelediye ${cleaned}`;
    }
  }

  for (const pattern of STYLE_VIOLATION_PATTERNS) {
    if (pattern.test(cleaned)) {
      violations.push(`Üslup ihlali: ${pattern.source}`);
    }
  }

  return {
    text: cleaned.trim(),
    ok: violations.length === 0,
    violations,
  };
}

/** Üslup ihlali sonrası yeniden yazım istemi. */
export function retryMessages({ plan, previousOutput, violations }) {
  return [
    {
      role: "system",
      content:
        "Sen belediye Instagram metin editörüsün. Ana yasaya ve referans " +
        "örneklere KESİNLİKLE uy.\n\n" +
        PROTOCOL_CONSTITUTION,
    },
    {
      role: "user",
      content:
        `Önceki metnin üslup anayasasına aykırıydı. Yeniden yaz.\n\n` +
        `İhlaller: ${violations.join("; ")}\n\n` +
        `[Plan]\n${plan}\n\n` +
        `[Hatalı metin]\n${previousOutput}\n\n` +
        `Referans örneklerle aynı resmi belediye haber üslubunda, ` +
        `tavsanlibelediye önekiyle başlayan nihai metni yaz.`,
    },
  ];
}
