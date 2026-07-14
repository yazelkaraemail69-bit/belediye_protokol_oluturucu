import type { Person } from "../types";
import { getPositionById } from "../data/protocolPositions";

const UNKNOWN_RANK = 999;

export function rankOf(person: Person): number {
  return getPositionById(person.positionId)?.rank ?? UNKNOWN_RANK;
}

/**
 * Kişileri protokol önem sırasına göre EKRAN dizilimine sokar.
 *
 * Kural (kullanıcı isteği): en önemliden en önemsize doğru "aşağıdan yukarıya".
 * Yani dönen dizide en önemsiz kişi başta (en üstte), en önemli kişi
 * sonda (en altta) yer alır.
 */
export function sortByProtocol(people: Person[]): Person[] {
  return [...people].sort((a, b) => {
    const rankDiff = rankOf(b) - rankOf(a); // büyük rank (önemsiz) üstte
    if (rankDiff !== 0) return rankDiff;
    return a.name.localeCompare(b.name, "tr");
  });
}

/**
 * Yeni kişiyi mevcut (manuel düzenlenmiş olabilen) dizilime protokol
 * sırasına uygun konuma yerleştirir. Böylece eklenen kişi otomatik olarak
 * doğru protokol noktasına düşer, mevcut manuel düzen bozulmaz.
 */
export function insertByRank(people: Person[], newPerson: Person): Person[] {
  const result = [...people];
  const newRank = rankOf(newPerson);
  // Ekran dizilimi üstten (önemsiz) alta (önemli) doğru olduğundan,
  // yeni kişi kendi rank'inden daha önemli (küçük rank) ilk kişiden önce girer.
  let insertAt = result.findIndex((p) => rankOf(p) < newRank);
  if (insertAt === -1) insertAt = result.length;
  result.splice(insertAt, 0, newPerson);
  return result;
}
