import type { Person } from "../types";

/**
 * Kişi verilerine erişim katmanı. Şu an localStorage tabanlıdır; sonraki
 * adımda API bağlandığında sadece bu arayüzü uygulayan yeni bir sınıf
 * yazmak yeterli olacak (uygulamanın geri kalanı değişmez).
 */
export interface PersonRepository {
  list(): Promise<Person[]>;
  save(people: Person[]): Promise<void>;
}

const STORAGE_KEY = "protokol.people";

export class LocalStoragePersonRepository implements PersonRepository {
  async list(): Promise<Person[]> {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as Person[];
      if (!Array.isArray(parsed)) return [];
      return parsed;
    } catch {
      return [];
    }
  }

  async save(people: Person[]): Promise<void> {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(people));
  }
}

export const personRepository: PersonRepository = new LocalStoragePersonRepository();
