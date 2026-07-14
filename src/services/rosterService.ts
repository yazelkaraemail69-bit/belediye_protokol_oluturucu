export interface RosterPerson {
  id: string;
  name: string;
  title: string;
  positionId: string;
  section: string;
}

export interface RosterResponse {
  people: RosterPerson[];
  sections: string[];
  count: number;
  fetchedAt: number;
  cached: boolean;
  source: string;
}

export async function fetchProtocolRoster(refresh = false): Promise<RosterResponse> {
  const qs = refresh ? "?refresh=1" : "";
  const res = await fetch(`/api/protocol/roster${qs}`);
  if (!res.ok) {
    let message = `Liste alınamadı (${res.status})`;
    try {
      const body = (await res.json()) as { error?: string };
      if (body.error) message = body.error;
    } catch {
      // yanıt okunamadı
    }
    throw new Error(message);
  }
  return (await res.json()) as RosterResponse;
}
