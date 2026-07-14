import { callModel } from "./openrouter.js";
import { AGENT_MODELS, AGENT_ROLES } from "./models.js";
import { socialPostMessages } from "./prompts.js";
import { enforceConstitution, retryMessages } from "./enforce.js";

/**
 * @typedef {{ name: string, title: string }} PersonInput
 * @typedef {{ municipality?: string, name?: string, date?: string, location?: string, notes?: string }} EventInput
 */

/**
 * Anayasaya bağlı, tek model ile Instagram paylaşım metni üretir.
 * (Eski 3 ajanlı hat maliyeti düşürmek için kaldırıldı.)
 *
 * @param {{ people: PersonInput[], event?: EventInput, examples?: string[] }} input
 * @param {{ signal?: AbortSignal }} [opts]
 */
export async function generateProtocol(input, opts = {}) {
  const { people, event } = input;
  const { signal } = opts;

  let raw = await callModel(
    AGENT_MODELS.writer,
    socialPostMessages({ people, event }),
    { temperature: 0.35, maxTokens: 350, signal },
  );

  let enforced = enforceConstitution(raw);

  if (!enforced.ok) {
    raw = await callModel(
      AGENT_MODELS.writer,
      retryMessages({
        people,
        event,
        previousOutput: raw,
        violations: enforced.violations,
      }),
      { temperature: 0.2, maxTokens: 350, signal },
    );
    enforced = enforceConstitution(raw);
  }

  const final = enforced.text;

  return {
    ordering: "",
    draft: "",
    final,
    agents: [
      {
        role: AGENT_ROLES.writer,
        model: AGENT_MODELS.writer,
        output: final,
      },
    ],
  };
}
