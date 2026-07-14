import { useEffect, useMemo, useState } from "react";
import {
  fetchProtocolRoster,
  type RosterPerson,
} from "../services/rosterService";
import { ListIcon, PlusIcon, SparkleIcon } from "./icons";

interface ProtocolRosterPickerProps {
  existingNames: string[];
  onAddMany: (
    entries: Array<{ name: string; positionId: string; titleLabel: string }>,
  ) => void;
}

function normalizeName(name: string) {
  return name.trim().toLocaleLowerCase("tr-TR");
}

export function ProtocolRosterPicker({
  existingNames,
  onAddMany,
}: ProtocolRosterPickerProps) {
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [people, setPeople] = useState<RosterPerson[]>([]);
  const [sections, setSections] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    new Set(),
  );

  const existing = useMemo(
    () => new Set(existingNames.map(normalizeName)),
    [existingNames],
  );

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    fetchProtocolRoster()
      .then((data) => {
        if (!active) return;
        setPeople(data.people);
        setSections(data.sections);
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Liste yüklenemedi");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr-TR");
    if (!q) return people;
    return people.filter(
      (p) =>
        p.name.toLocaleLowerCase("tr-TR").includes(q) ||
        p.title.toLocaleLowerCase("tr-TR").includes(q) ||
        p.section.toLocaleLowerCase("tr-TR").includes(q),
    );
  }, [people, query]);

  const grouped = useMemo(() => {
    const map = new Map<string, RosterPerson[]>();
    for (const section of sections) {
      map.set(section, []);
    }
    for (const person of filtered) {
      if (!map.has(person.section)) map.set(person.section, []);
      map.get(person.section)!.push(person);
    }
    return [...map.entries()].filter(([, list]) => list.length > 0);
  }, [filtered, sections]);

  function togglePerson(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSection(_section: string, list: RosterPerson[]) {
    const selectable = list.filter((p) => !existing.has(normalizeName(p.name)));
    const allSelected = selectable.every((p) => selected.has(p.id));
    setSelected((prev) => {
      const next = new Set(prev);
      for (const p of selectable) {
        if (allSelected) next.delete(p.id);
        else next.add(p.id);
      }
      return next;
    });
  }

  function toggleSectionCollapse(section: string) {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  }

  function handleAddSelected() {
    const entries = people
      .filter((p) => selected.has(p.id))
      .map((p) => ({
        name: p.name,
        positionId: p.positionId,
        titleLabel: p.title,
      }));
    if (entries.length === 0) return;
    onAddMany(entries);
    setSelected(new Set());
  }

  async function handleRefresh() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchProtocolRoster(true);
      setPeople(data.people);
      setSections(data.sections);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Liste yenilenemedi");
    } finally {
      setLoading(false);
    }
  }

  const selectedCount = selected.size;

  return (
    <div className="section">
      <div className="badge">
        <span className="dot" />
        Tavşanlı Protokol Listesi
      </div>

      <div className="card roster-card">
        <div className="roster-head">
          <p className="order-hint" style={{ margin: 0, maxWidth: "none" }}>
            <ListIcon size={14} />{" "}
            <a
              href="https://tavsanli.gov.tr/protokol"
              target="_blank"
              rel="noreferrer"
            >
              tavsanli.gov.tr/protokol
            </a>{" "}
            listesinden kişi işaretleyerek ekleyin.
          </p>
          <div className="roster-head-actions">
            <button
              type="button"
              className="btn btn-ghost btn-mono"
              onClick={() => setOpen((v) => !v)}
            >
              {open ? "Gizle" : "Göster"}
            </button>
            <button
              type="button"
              className="btn btn-ghost btn-mono"
              onClick={handleRefresh}
              disabled={loading}
            >
              Yenile
            </button>
          </div>
        </div>

        {open && (
          <>
            <input
              className="input roster-search"
              placeholder="Ad, unvan veya kurum ara…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            {loading && (
              <div className="empty">
                <span className="spinner" /> Protokol listesi yükleniyor…
              </div>
            )}

            {error && <div className="login-error">{error}</div>}

            {!loading && !error && (
              <div className="roster-scroll">
                {grouped.length === 0 ? (
                  <div className="empty">Sonuç bulunamadı.</div>
                ) : (
                  grouped.map(([section, list]) => {
                    const collapsed = collapsedSections.has(section);
                    const selectable = list.filter(
                      (p) => !existing.has(normalizeName(p.name)),
                    );
                    const sectionAllSelected =
                      selectable.length > 0 &&
                      selectable.every((p) => selected.has(p.id));

                    return (
                      <div key={section} className="roster-section">
                        <div className="roster-section-head">
                          <button
                            type="button"
                            className="roster-section-toggle"
                            onClick={() => toggleSectionCollapse(section)}
                          >
                            {collapsed ? "▸" : "▾"} {section}
                            <span className="roster-section-count">
                              {list.length}
                            </span>
                          </button>
                          <button
                            type="button"
                            className="link-btn"
                            onClick={() => toggleSection(section, list)}
                            disabled={selectable.length === 0}
                          >
                            {sectionAllSelected ? "Seçimi kaldır" : "Tümünü seç"}
                          </button>
                        </div>

                        {!collapsed && (
                          <div className="roster-grid">
                            {list.map((person) => {
                              const added = existing.has(
                                normalizeName(person.name),
                              );
                              const checked = selected.has(person.id);
                              return (
                                <label
                                  key={person.id}
                                  className={[
                                    "roster-item",
                                    checked ? "selected" : "",
                                    added ? "added" : "",
                                  ]
                                    .filter(Boolean)
                                    .join(" ")}
                                >
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    disabled={added}
                                    onChange={() => togglePerson(person.id)}
                                  />
                                  <span className="roster-item-body">
                                    <span className="roster-item-name">
                                      {person.name}
                                    </span>
                                    <span className="roster-item-title">
                                      {person.title}
                                    </span>
                                  </span>
                                  {added && (
                                    <span className="roster-added-tag">
                                      Eklendi
                                    </span>
                                  )}
                                </label>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}

            <div className="roster-footer">
              <span className="field-hint">
                {selectedCount > 0
                  ? `${selectedCount} kişi seçildi`
                  : "Listeden işaretleyerek seçin"}
              </span>
              <button
                type="button"
                className="btn btn-primary"
                disabled={selectedCount === 0}
                onClick={handleAddSelected}
              >
                <PlusIcon size={16} />
                Seçilenleri Protokole Ekle
              </button>
            </div>

            {!loading && people.length > 0 && (
              <p className="field-hint roster-meta">
                <SparkleIcon size={12} /> {people.length} kişi · kaynak:
                tavsanli.gov.tr
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
