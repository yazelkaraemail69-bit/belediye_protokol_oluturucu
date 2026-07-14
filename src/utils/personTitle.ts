import type { Person } from "../types";
import { getPositionById } from "../data/protocolPositions";

/** Kişinin ekranda ve AI'da kullanılacak unvan metni. */
export function getPersonTitle(person: Person): string {
  return (
    person.titleLabel?.trim() ||
    getPositionById(person.positionId)?.title ||
    "Diğer / Davetli"
  );
}
