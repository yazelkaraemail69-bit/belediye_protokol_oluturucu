import { callModel } from "./openrouter.js";
import { AGENT_MODELS, AGENT_ROLES } from "./models.js";
import { plannerMessages, writerMessages } from "./prompts.js";

/**
 * @typedef {{ name: string, title: string }} PersonInput
 * @typedef {{ municipality?: string, name?: string, date?: string, location?: string, notes?: string }} EventInput
 */

/**
 * 2 ajanlı üretim hattı:
 * 1) DeepSeek → protokol planı (ucuz muhakeme)
 * 2) Gemini 2.5 Pro → nihai Instagram metni (üstün dil kalitesi)
 *
 * @param {{ people: PersonInput[], event?: EventInput, examples?: string[] }} input
 * @param {{ signal?: AbortSignal }} [opts]
 */
export async function generateProtocol(input, opts = {}) {
  const { people, event } = input;
  const { signal } = opts;

  const plan = await callModel(
    AGENT_MODELS.planner,
    plannerMessages({ people, event }),
    { temperature: 0.2, maxTokens: 600, signal },
  );

  const final = await callModel(
    AGENT_MODELS.writer,
    writerMessages({ people, event, plan }),
    { temperature: 0.4, maxTokens: 500, signal },
  );

  return {
    ordering: plan,
    draft: "",
    final: final.trim(),
    agents: [
      {
        role: AGENT_ROLES.planner,
        model: AGENT_MODELS.planner,
        output: plan,
      },
      {
        role: AGENT_ROLES.writer,
        model: AGENT_MODELS.writer,
        output: final.trim(),
      },
    ],
  };
}
