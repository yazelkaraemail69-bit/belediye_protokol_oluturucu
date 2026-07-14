import { useEffect, useState } from "react";
import type { AuthUser } from "../services/authService";
import type { Person } from "../types";
import { personRepository } from "../services/personRepository";
import { insertByRank, sortByProtocol } from "../utils/protocolOrder";
import { PersonForm } from "./PersonForm";
import { ProtocolRosterPicker } from "./ProtocolRosterPicker";
import { ProtocolOrderPanel } from "./ProtocolOrderPanel";
import { ProtocolTextPanel } from "./ProtocolTextPanel";
import { FileIcon, UserIcon } from "./icons";

interface ProtocolAppProps {
  user: AuthUser;
  onLogout: () => void;
}

function createId(): string {
  return `p_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function ProtocolApp({ user, onLogout }: ProtocolAppProps) {
  const [people, setPeople] = useState<Person[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    personRepository.list().then((stored) => {
      if (!active) return;
      setPeople(stored);
      setLoaded(true);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!loaded) return;
    void personRepository.save(people);
  }, [people, loaded]);

  function handleAdd(name: string, positionId: string, titleLabel?: string) {
    const person: Person = {
      id: createId(),
      name,
      positionId,
      ...(titleLabel ? { titleLabel } : {}),
    };
    setPeople((prev) => insertByRank(prev, person));
  }

  function handleAddMany(
    entries: Array<{ name: string; positionId: string; titleLabel?: string }>,
  ) {
    setPeople((prev) => {
      let next = [...prev];
      for (const entry of entries) {
        const exists = next.some(
          (p) =>
            p.name.localeCompare(entry.name, "tr", { sensitivity: "base" }) === 0,
        );
        if (exists) continue;
        next = insertByRank(next, {
          id: createId(),
          name: entry.name,
          positionId: entry.positionId,
          ...(entry.titleLabel ? { titleLabel: entry.titleLabel } : {}),
        });
      }
      return next;
    });
  }

  function handleRemove(id: string) {
    setPeople((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div className="app-shell">
      <div className="container">
        <div className="header-row">
          <div className="app-header">
            <span className="brand-icon">
              <FileIcon size={22} />
            </span>
            <div>
              <h1 className="title">Protokol Oluşturucu</h1>
              <div className="subtitle">v1.0 — Müşteri Protokol Aracı</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span className="user-chip">
              <UserIcon size={14} /> {user.displayName}
            </span>
            <button className="link-btn" onClick={onLogout}>
              Çıkış
            </button>
          </div>
        </div>

        <div className="divider" />

        <div className="badge">Müşteri Paneli</div>
        <ProtocolRosterPicker
          existingNames={people.map((p) => p.name)}
          onAddMany={handleAddMany}
        />
        <PersonForm onAdd={handleAdd} />

        <ProtocolOrderPanel
          people={people}
          onReorder={setPeople}
          onRemove={handleRemove}
          onAutoSort={() => setPeople((prev) => sortByProtocol(prev))}
        />

        <ProtocolTextPanel people={people} />
      </div>
    </div>
  );
}
