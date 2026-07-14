import { useState } from "react";
import type { Person } from "../types";
import { getPositionById } from "../data/protocolPositions";
import { GripIcon, TrashIcon, ListIcon, SparkleIcon } from "./icons";

interface ProtocolOrderPanelProps {
  people: Person[];
  onReorder: (people: Person[]) => void;
  onRemove: (id: string) => void;
  onAutoSort: () => void;
}

/**
 * Protokol önem sırası paneli.
 * Liste EKRAN dizilimi: en üst = en önemsiz, en alt = en önemli.
 * Bu yüzden görsel numara (protokol sırası) en alttan başlayıp yukarı çıkar.
 */
export function ProtocolOrderPanel({
  people,
  onReorder,
  onRemove,
  onAutoSort,
}: ProtocolOrderPanelProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  function handleDrop(targetIndex: number) {
    if (dragIndex === null || dragIndex === targetIndex) {
      setDragIndex(null);
      setOverIndex(null);
      return;
    }
    const next = [...people];
    const [moved] = next.splice(dragIndex, 1);
    next.splice(targetIndex, 0, moved);
    onReorder(next);
    setDragIndex(null);
    setOverIndex(null);
  }

  return (
    <div className="section">
      <div className="badge">
        <span className="dot" />
        Protokol Önem Sırası
      </div>

      <div className="card accent">
        <div className="header-row" style={{ marginBottom: 12 }}>
          <p className="order-hint" style={{ margin: 0 }}>
            <ListIcon size={14} /> En önemli en <b>altta</b>, en önemsiz en{" "}
            <b>üstte</b>. Sürükleyerek elle düzenleyebilirsiniz.
          </p>
          <button className="btn btn-ghost btn-mono" onClick={onAutoSort}>
            <SparkleIcon size={14} /> Otomatik Sırala
          </button>
        </div>

        {people.length === 0 ? (
          <div className="empty">
            Henüz kişi eklenmedi. Yukarıdan kişi ekleyin, protokol sırası burada
            oluşacak.
          </div>
        ) : (
          <div className="order-list">
            {people.map((person, index) => {
              const position = getPositionById(person.positionId);
              // En alttaki kişi 1 numara (en önemli)
              const protocolNo = people.length - index;
              const isMostImportant = index === people.length - 1;
              return (
                <div
                  key={person.id}
                  className={[
                    "order-item",
                    dragIndex === index ? "dragging" : "",
                    overIndex === index && dragIndex !== index
                      ? "drop-target"
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  draggable
                  onDragStart={() => setDragIndex(index)}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setOverIndex(index);
                  }}
                  onDrop={() => handleDrop(index)}
                  onDragEnd={() => {
                    setDragIndex(null);
                    setOverIndex(null);
                  }}
                >
                  <span className="grip" aria-label="Sürükle">
                    <GripIcon />
                  </span>
                  <span className="rank-chip">{protocolNo}</span>
                  <div className="grow">
                    <div className="person-name">{person.name}</div>
                    <div className="person-pos">
                      {position?.title ?? "Bilinmeyen mevki"}
                    </div>
                  </div>
                  {isMostImportant && (
                    <span className="most-important-tag">EN ÖNEMLİ</span>
                  )}
                  <button
                    className="icon-btn danger"
                    onClick={() => onRemove(person.id)}
                    aria-label={`${person.name} kişisini sil`}
                  >
                    <TrashIcon />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
