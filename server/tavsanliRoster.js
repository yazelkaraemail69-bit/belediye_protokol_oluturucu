import { mapTitleToPositionId } from "./positionMap.js";

function decodeHtml(html) {
  return html
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&uuml;/gi, "ü")
    .replace(/&Uuml;/g, "Ü")
    .replace(/&ouml;/gi, "ö")
    .replace(/&Ouml;/g, "Ö")
    .replace(/&ccedil;/gi, "ç")
    .replace(/&Ccedil;/g, "Ç")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function stripCell(html) {
  return decodeHtml(html);
}

function formatPersonName(name) {
  return name
    .trim()
    .split(/\s+/)
    .map((part) => {
      const lower = part.toLocaleLowerCase("tr-TR");
      if (/^(prof|dr|doç|av)\.?$/i.test(part)) {
        return lower.replace(/\.$/, "") + ".";
      }
      return lower.charAt(0).toLocaleUpperCase("tr-TR") + lower.slice(1);
    })
    .join(" ");
}

function slug(value) {
  return stripCell(value)
    .toLocaleLowerCase("tr-TR")
    .replace(/[^a-z0-9ğüşıöç]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);
}

/**
 * tavsanli.gov.tr/protokol HTML'inden kişi listesini çıkarır.
 * @param {string} html
 */
export function parseTavsanliProtokolHtml(html) {
  /** @type {Array<{ id: string, name: string, title: string, positionId: string, section: string }>} */
  const people = [];
  const marker = "TAVŞANLI İLÇESİ TEBRİGAT VE PROTOKOL LİSTESİ";
  const startIdx = html.indexOf(marker);
  const slice = startIdx >= 0 ? html.slice(startIdx) : html;

  const tableRegex = /<table[^>]*class="MsoTableGrid"[^>]*>([\s\S]*?)<\/table>/gi;
  let tableMatch;
  let section = "Genel";

  while ((tableMatch = tableRegex.exec(slice)) !== null) {
    const tableHtml = tableMatch[1];
    const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    let rowMatch;

    while ((rowMatch = rowRegex.exec(tableHtml)) !== null) {
      const rowHtml = rowMatch[1];

      if (
        /colspan\s*=\s*["']2["']/i.test(rowHtml) &&
        /#bfbfbf|background:\s*rgb\(191,\s*191,\s*191\)/i.test(rowHtml)
      ) {
        section = stripCell(rowHtml) || section;
        continue;
      }

      const cells = [...rowHtml.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((m) =>
        stripCell(m[1]),
      );

      if (cells.length < 2) continue;

      let title = cells[0];
      let name = cells[1];

      if (!name || name.length < 2) continue;
      if (/^(tel|telefon|fax|e-posta|adres)/i.test(name)) continue;

      const positionId = mapTitleToPositionId(title);
      const id = slug(`${section}-${title}-${name}`);

      people.push({
        id,
        name: formatPersonName(name),
        title,
        positionId,
        section: section.trim() || "Genel",
      });
    }
  }

  const seen = new Set();
  return people.filter((p) => {
    const key = `${p.name}|${p.title}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const ROSTER_URL = "https://tavsanli.gov.tr/protokol";
const CACHE_MS = 60 * 60 * 1000;

/** @type {{ fetchedAt: number, people: ReturnType<typeof parseTavsanliProtokolHtml> } | null} */
let cache = null;

/**
 * Tavşanlı protokol listesini getirir (1 saat önbellek).
 * @param {{ refresh?: boolean }} [opts]
 */
export async function fetchTavsanliRoster(opts = {}) {
  const now = Date.now();
  if (!opts.refresh && cache && now - cache.fetchedAt < CACHE_MS) {
    return { ...cache, cached: true, source: ROSTER_URL };
  }

  const res = await fetch(ROSTER_URL, {
    headers: {
      "User-Agent":
        "BelediyeProtokolModulu/1.0 (+https://belediye-protokol-olu-turucu.vercel.app)",
      Accept: "text/html",
    },
    signal: AbortSignal.timeout(25_000),
  });

  if (!res.ok) {
    throw new Error(`Protokol sayfası alınamadı (HTTP ${res.status})`);
  }

  const html = await res.text();
  const people = parseTavsanliProtokolHtml(html);

  if (people.length === 0) {
    throw new Error("Protokol listesi parse edilemedi.");
  }

  cache = { fetchedAt: now, people };
  return { fetchedAt: now, people, cached: false, source: ROSTER_URL };
}
