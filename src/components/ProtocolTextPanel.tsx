import { useRef, useState } from "react";
import type { Person } from "../types";
import {
  generateProtocolText,
  type EventContext,
  type ProtocolResult,
} from "../services/protocolAiService";
import { FileIcon, SparkleIcon, CopyIcon } from "./icons";

interface ProtocolTextPanelProps {
  people: Person[];
}

/**
 * AI ile Instagram paylaşım metni — DeepSeek planlar, Gemini yazar.
 */
export function ProtocolTextPanel({ people }: ProtocolTextPanelProps) {
  const [event, setEvent] = useState<EventContext>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ProtocolResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [showAgents, setShowAgents] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  function updateEvent(field: keyof EventContext, value: string) {
    setEvent((prev) => ({ ...prev, [field]: value }));
  }

  async function handleGenerate() {
    if (people.length === 0 || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const res = await generateProtocolText(people, event, controller.signal);
      setResult(res);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setError(err instanceof Error ? err.message : "Bilinmeyen hata");
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  }

  function handleCancel() {
    abortRef.current?.abort();
    setLoading(false);
  }

  async function handleCopy() {
    if (!result) return;
    await navigator.clipboard.writeText(result.final);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="section">
      <div className="badge">
        <span className="dot" />
        Instagram Paylaşım Metni
      </div>

      <div className="card">
        <p className="order-hint" style={{ maxWidth: "none" }}>
          <SparkleIcon size={14} /> DeepSeek yazım planını çıkarır, Gemini 2.5 Pro
          Tavşanlı Belediyesi referans üslubunda resmi Instagram metnini yazar.
          Örnek metinler ve anayasa üslup dışına çıkmayı engeller.
        </p>

        <div className="event-grid">
          <input
            className="input"
            placeholder="Belediye adı (ör. Tavşanlı Belediyesi)"
            value={event.municipality ?? ""}
            onChange={(e) => updateEvent("municipality", e.target.value)}
          />
          <input
            className="input"
            placeholder="Olay / etkinlik (ör. Funda Sokağa okul açılışı, saha incelemesi)"
            value={event.name ?? ""}
            onChange={(e) => updateEvent("name", e.target.value)}
          />
          <input
            className="input"
            placeholder="Tarih (isteğe bağlı)"
            value={event.date ?? ""}
            onChange={(e) => updateEvent("date", e.target.value)}
          />
          <input
            className="input"
            placeholder="Yer (isteğe bağlı)"
            value={event.location ?? ""}
            onChange={(e) => updateEvent("location", e.target.value)}
          />
        </div>
        <textarea
          className="textarea input-mt"
          placeholder="Ek not: program akışı, ziyaret detayı, vurgulanacak hususlar…"
          value={event.notes ?? ""}
          onChange={(e) => updateEvent("notes", e.target.value)}
        />

        <div className="actions-row">
          <button
            className="btn btn-primary"
            onClick={handleGenerate}
            disabled={people.length === 0 || loading}
          >
            {loading ? (
              <>
                <span className="spinner" /> Oluşturuluyor…
              </>
            ) : (
              <>
                <SparkleIcon size={14} /> Instagram Metni Oluştur
              </>
            )}
          </button>
          {loading && (
            <button className="btn btn-ghost" onClick={handleCancel}>
              İptal
            </button>
          )}
        </div>

        {people.length === 0 && (
          <p className="field-hint" style={{ marginTop: 8 }}>
            Önce yukarıdan en az bir kişi ekleyin.
          </p>
        )}

        {error && <div className="login-error" style={{ marginTop: 14 }}>{error}</div>}

        {result && (
          <div className="result-block">
            <div className="result-head">
              <span className="result-title">
                <FileIcon size={16} /> Paylaşım Metni
              </span>
              <button className="btn btn-ghost btn-mono" onClick={handleCopy}>
                <CopyIcon size={14} /> {copied ? "Kopyalandı" : "Kopyala"}
              </button>
            </div>
            <pre className="result-text">{result.final}</pre>
            <p className="field-hint" style={{ marginTop: 8 }}>
              {result.final.length} karakter
            </p>

            <button
              className="link-btn"
              style={{ marginTop: 12 }}
              onClick={() => setShowAgents((v) => !v)}
            >
              {showAgents ? "Ajan çıktılarını gizle" : "Ajan çıktılarını göster"}
            </button>

            {showAgents && (
              <div className="agent-list">
                {result.agents.map((a) => (
                  <div key={a.role} className="agent-item">
                    <div className="agent-head">
                      <b>{a.role}</b>
                      <span className="agent-model">{a.model}</span>
                    </div>
                    <pre className="result-text small">{a.output}</pre>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
