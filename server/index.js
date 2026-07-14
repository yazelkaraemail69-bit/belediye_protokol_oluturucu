import app from "./app.js";
import { config, hasApiKey } from "./config.js";

app.listen(config.port, () => {
  console.log(`Protokol API http://localhost:${config.port} üzerinde çalışıyor`);
  if (!hasApiKey()) {
    console.warn(
      "UYARI: OPENROUTER_API_KEY tanımlı değil. /api/protocol/generate çalışmaz.",
    );
  }
});
