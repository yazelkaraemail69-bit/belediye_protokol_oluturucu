import type { ProtocolPosition } from "../types";

/**
 * Türkiye devlet protokol sırasına göre yaygın mevkiler.
 * `rank` küçüldükçe önem artar (1 = en önemli).
 *
 * Not: Bu liste belediye/il düzeyinde sık karşılaşılan unvanları içerir ve
 * ihtiyaca göre genişletilebilir. API bağlandığında bu veri sunucudan gelebilir.
 */
export const PROTOCOL_POSITIONS: ProtocolPosition[] = [
  { id: "cumhurbaskani", title: "Cumhurbaşkanı", rank: 1 },
  { id: "tbmm-baskani", title: "TBMM Başkanı", rank: 2 },
  { id: "bakan", title: "Bakan", rank: 3 },
  { id: "milletvekili", title: "Milletvekili", rank: 4 },
  { id: "vali", title: "Vali", rank: 5 },
  { id: "buyuksehir-belediye-baskani", title: "Büyükşehir Belediye Başkanı", rank: 6 },
  { id: "belediye-baskani", title: "Belediye Başkanı", rank: 7 },
  { id: "il-genel-meclisi-baskani", title: "İl Genel Meclisi Başkanı", rank: 8 },
  { id: "kaymakam", title: "Kaymakam", rank: 9 },
  { id: "garnizon-komutani", title: "Garnizon Komutanı", rank: 10 },
  { id: "cumhuriyet-bassavcisi", title: "Cumhuriyet Başsavcısı", rank: 11 },
  { id: "baro-baskani", title: "Baro Başkanı", rank: 12 },
  { id: "rektor", title: "Rektör", rank: 13 },
  { id: "il-mudur", title: "İl Müdürü", rank: 14 },
  { id: "belediye-meclis-uyesi", title: "Belediye Meclis Üyesi", rank: 15 },
  { id: "muhtar", title: "Muhtar", rank: 16 },
  { id: "daire-baskani", title: "Daire Başkanı", rank: 17 },
  { id: "sube-muduru", title: "Şube Müdürü", rank: 18 },
  { id: "stk-baskani", title: "STK / Dernek Başkanı", rank: 19 },
  { id: "diger", title: "Diğer / Davetli", rank: 99 },
];

const POSITION_BY_ID = new Map(PROTOCOL_POSITIONS.map((p) => [p.id, p]));

export function getPositionById(id: string): ProtocolPosition | undefined {
  return POSITION_BY_ID.get(id);
}
