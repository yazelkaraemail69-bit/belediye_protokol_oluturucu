import express from "express";
import cors from "cors";
import { hasApiKey } from "./config.js";
import { AGENT_MODELS, AGENT_ROLES } from "./models.js";
import { generateProtocol } from "./pipeline.js";
import { fetchTavsanliRoster } from "./tavsanliRoster.js";
import { ApiKeyMissingError, OpenRouterError } from "./openrouter.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    apiKeyConfigured: hasApiKey(),
    agents: Object.entries(AGENT_MODELS).map(([key, model]) => ({
      key,
      role: AGENT_ROLES[key],
      model,
    })),
  });
});

app.get("/api/protocol/roster", async (req, res) => {
  try {
    const refresh = req.query.refresh === "1" || req.query.refresh === "true";
    const data = await fetchTavsanliRoster({ refresh });
    const sections = [...new Set(data.people.map((p) => p.section))];
    res.json({
      people: data.people,
      sections,
      count: data.people.length,
      fetchedAt: data.fetchedAt,
      cached: data.cached,
      source: data.source,
    });
  } catch (err) {
    console.error("Protokol listesi hatası:", err);
    res.status(502).json({
      error: err instanceof Error ? err.message : "Protokol listesi alınamadı.",
    });
  }
});

app.post("/api/protocol/generate", async (req, res) => {
  const { people, event, examples } = req.body ?? {};

  if (!Array.isArray(people) || people.length === 0) {
    res.status(400).json({ error: "En az bir kişi gerekli." });
    return;
  }

  const normalized = people
    .map((p) => ({
      name: String(p?.name ?? "").trim(),
      title: String(p?.title ?? "").trim(),
    }))
    .filter((p) => p.name !== "");

  if (normalized.length === 0) {
    res.status(400).json({ error: "Geçerli kişi bulunamadı." });
    return;
  }

  try {
    const result = await generateProtocol({
      people: normalized,
      event: event ?? {},
      examples: Array.isArray(examples) ? examples : [],
    });
    res.json(result);
  } catch (err) {
    if (err instanceof ApiKeyMissingError) {
      res.status(503).json({ error: err.message, code: err.code });
      return;
    }
    if (err instanceof OpenRouterError) {
      res
        .status(502)
        .json({ error: err.message, code: err.code, model: err.model });
      return;
    }
    console.error("Protokol üretim hatası:", err);
    res.status(500).json({ error: "Beklenmeyen sunucu hatası." });
  }
});

export default app;
