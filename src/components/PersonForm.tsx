import { useState } from "react";
import type { FormEvent } from "react";
import { PROTOCOL_POSITIONS } from "../data/protocolPositions";
import { UserIcon, BadgeIcon, PlusIcon } from "./icons";

interface PersonFormProps {
  onAdd: (name: string, positionId: string) => void;
}

const DEFAULT_POSITION = "belediye-baskani";

export function PersonForm({ onAdd }: PersonFormProps) {
  const [name, setName] = useState("");
  const [positionId, setPositionId] = useState(DEFAULT_POSITION);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onAdd(trimmed, positionId);
    setName("");
    setPositionId(DEFAULT_POSITION);
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <div className="field-row">
        <span className="field-icon">
          <UserIcon />
        </span>
        <div className="field-body">
          <div className="field-label">Ad Soyad</div>
          <div className="field-hint">Protokole eklenecek kişinin adı</div>
          <input
            className="input input-mt"
            type="text"
            placeholder="ör. Ahmet Yılmaz"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
      </div>

      <div className="field-row">
        <span className="field-icon">
          <BadgeIcon />
        </span>
        <div className="field-body">
          <div className="field-label">Mevki / Unvan</div>
          <div className="field-hint">
            Önem sırası bu mevkiye göre otomatik belirlenir
          </div>
          <select
            className="select input-mt"
            value={positionId}
            onChange={(e) => setPositionId(e.target.value)}
          >
            {PROTOCOL_POSITIONS.map((pos) => (
              <option key={pos.id} value={pos.id}>
                {pos.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="actions-row">
        <button type="submit" className="btn btn-primary" disabled={!name.trim()}>
          <PlusIcon size={16} />
          Kişiyi Ekle
        </button>
      </div>
    </form>
  );
}
