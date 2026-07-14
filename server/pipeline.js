import { callModel } from "./openrouter.js";
import { AGENT_MODELS, AGENT_ROLES } from "./models.js";
import { plannerMessages, writerMessages } from "./prompts.js";
import { enforceConstitution, retryMessages } from "./enforce.js";

/**
 * @typedef {{ name: string, title: string }} PersonInput
 * @typedef {{ municipality?: string, name?: string, date?: string, location?: string, notes?: string }} EventInput
 */

/**
 * 2 ajanlı üretim hattı (referans örnekler + anayasa):
 * 1) DeepSeek → yapısal yazım planı
 * 2) Gemini 2.5 Pro → referans üslubunda nihai metin
 */
export async function generateProtocol(input, opts = {}) {
  const { people, event } = input;
  const { signal } = opts;

  const plan = await callModel(
    AGENT_MODELS.planner,
    plannerMessages({ people, event }),
    { temperature: 0.25, maxTokens: 2000, signal },
  );

  let raw = await callModel(
    AGENT_MODELS.writer,
    writerMessages({ people, event, plan }),
    { temperature: 0.35, maxTokens: 8000, signal },
  );

  let enforced = enforceConstitution(raw);

  if (!enforced.ok) {
    raw = await callModel(
      AGENT_MODELS.writer,
      retryMessages({
        plan,
        previousOutput: raw,
        violations: enforced.violations,
      }),
      { temperature: 0.25, maxTokens: 8000, signal },
    );
    enforced = enforceConstitution(raw);
  }

  const final = enforced.text;

  return {
    ordering: plan,
    draft: "",
    final,
    agents: [
      {
        role: AGENT_ROLES.planner,
        model: AGENT_MODELS.planner,
        output: plan,
      },
      {
        role: AGENT_ROLES.writer,
        model: AGENT_MODELS.writer,
        output: final,
      },
    ],
  };
}
