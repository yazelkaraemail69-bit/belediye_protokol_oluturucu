/**
 * Tavşanlı protokol sayfasındaki unvan metnini uygulama mevki kimliğine eşler.
 * @param {string} title
 * @returns {string} positionId
 */
export function mapTitleToPositionId(title) {
  const t = normalizeText(title).toLowerCase();

  if (t.includes("cumhurbaşkan")) return "cumhurbaskani";
  if (t.includes("tbmm başkan")) return "tbmm-baskani";
  if (t.includes("milletvekili")) return "milletvekili";
  if (/\bvali\b/.test(t)) return "vali";
  if (t.includes("kaymakam")) return "kaymakam";
  if (t.includes("belediye başkan vekili") || t.includes("belediye baskani vekili"))
    return "belediye-baskan-yardimcisi";
  if (t.includes("belediye başkan yardımc")) return "belediye-baskan-yardimcisi";
  if (t.includes("belediye başkan") || t.includes("belediye baskani"))
    return "belediye-baskani";
  if (t.includes("büyükşehir") && t.includes("başkan")) return "buyuksehir-belediye-baskani";
  if (t.includes("cumhuriyet başsavc")) return "cumhuriyet-bassavcisi";
  if (t.includes("garnizon komutan") || t.includes("tugay komutan"))
    return "garnizon-komutani";
  if (t.includes("rektör") || t.includes("rektor")) return "rektor";
  if (t.includes("baro başkan")) return "baro-baskani";
  if (t.includes("il müdür") || t.includes("il mudur")) return "il-mudur";
  if (t.includes("müdür") || t.includes("mudur")) return "sube-muduru";
  if (t.includes("muhtar")) return "muhtar";
  if (t.includes("meclis üyesi")) return "belediye-meclis-uyesi";

  return "diger";
}

function normalizeText(value) {
  return decodeHtml(String(value ?? ""))
    .replace(/\s+/g, " ")
    .trim();
}

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
