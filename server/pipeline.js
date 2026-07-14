import { callModel } from "./openrouter.js";
import { AGENT_MODELS, AGENT_ROLES } from "./models.js";
import { ordererMessages, writerMessages, editorMessages } from "./prompts.js";

/**
 * @typedef {{ name: string, title: string }} PersonInput
 * @typedef {{ name?: string, date?: string, location?: string, notes?: string }} EventInput
 */

/**
 * Üç modelin iş bölümü yaptığı protokol üretim hattı.
 *
 * @param {{ people: PersonInput[], event?: EventInput, examples?: string[] }} input
 * @param {{ signal?: AbortSignal }} [opts]
 * @returns {Promise<{
 *   ordering: string,
 *   draft: string,
 *   final: string,
 *   agents: Array<{ role: string, model: string, output: string }>
 * }>}
 */
export async function generateProtocol(input, opts = {}) {
  const { people, event, examples } = input;
  const { signal } = opts;

  // 1) Sıralama uzmanı
  const ordering = await callModel(
    AGENT_MODELS.orderer,
    ordererMessages({ people, event, examples }),
    { temperature: 0.2, maxTokens: 3000, signal },
  );

  // 2) Redaktör (sıralamaya dayanır)
  const draft = await callModel(
    AGENT_MODELS.writer,
    writerMessages({ event, ordering, examples }),
    { temperature: 0.5, maxTokens: 5000, signal },
  );

  // 3) Baş editör (birleştirir + nihai belge).
  // Editör bir "düşünen" model olabildiğinden, akıl yürütme jetonlarının
  // nihai metni kısaltmaması için jeton bütçesi yüksek tutulur.
  const final = await callModel(
    AGENT_MODELS.editor,
    editorMessages({ event, ordering, draft, examples }),
    { temperature: 0.3, maxTokens: 12000, signal },
  );

  return {
    ordering,
    draft,
    final,
    agents: [
      { role: AGENT_ROLES.orderer, model: AGENT_MODELS.orderer, output: ordering },
      { role: AGENT_ROLES.writer, model: AGENT_MODELS.writer, output: draft },
      { role: AGENT_ROLES.editor, model: AGENT_MODELS.editor, output: final },
    ],
  };
}
