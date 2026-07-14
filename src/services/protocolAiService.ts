import type { Person } from "../types";
import { getPositionById } from "../data/protocolPositions";

export interface EventContext {
  municipality?: string;
  name?: string;
  date?: string;
  location?: string;
  notes?: string;
}

export interface AgentOutput {
  role: string;
  model: string;
  output: string;
}

export interface ProtocolResult {
  ordering: string;
  draft: string;
  final: string;
  agents: AgentOutput[];
}

interface GeneratePayloadPerson {
  name: string;
  title: string;
}

/**
 * Panelin ekran dizilimini (üst = en önemsiz, alt = en önemli) protokol
 * sırasına (en önemli önce) çevirir. Böylece kullanıcının elle yaptığı
 * sıralama AI'a doğru öncelik sırasıyla iletilir.
 */
function toPayloadPeople(people: Person[]): GeneratePayloadPerson[] {
  return [...people].reverse().map((p) => ({
    name: p.name,
    title: getPositionById(p.positionId)?.title ?? "Diğer / Davetli",
  }));
}

export async function generateProtocolText(
  people: Person[],
  event: EventContext,
  signal?: AbortSignal,
): Promise<ProtocolResult> {
  const res = await fetch("/api/protocol/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ people: toPayloadPeople(people), event }),
    signal,
  });

  if (!res.ok) {
    let message = `Sunucu hatası (${res.status})`;
    try {
      const body = (await res.json()) as { error?: string };
      if (body.error) message = body.error;
    } catch {
      // yanıt gövdesi okunamadı; varsayılan mesaj kullanılır
    }
    throw new Error(message);
  }

  return (await res.json()) as ProtocolResult;
}
