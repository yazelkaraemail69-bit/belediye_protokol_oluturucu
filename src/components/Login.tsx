import { useState } from "react";
import type { FormEvent } from "react";
import { authService, type AuthUser } from "../services/authService";
import { FileIcon, LockIcon, ArrowRightIcon, UserIcon } from "./icons";

interface LoginProps {
  onLogin: (user: AuthUser) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await authService.login(username, password);
      onLogin(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Giriş başarısız.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="login-head">
          <span className="brand-icon">
            <FileIcon size={24} />
          </span>
          <h1 className="title">Protokol Oluşturucu</h1>
          <div className="subtitle">v1.0 — MÜŞTERİ GİRİŞİ</div>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Kullanıcı Adı</label>
            <input
              id="username"
              className="input"
              type="text"
              autoComplete="username"
              placeholder="Kullanıcı adınız"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Şifre</label>
            <input
              id="password"
              className="input"
              type="password"
              autoComplete="current-password"
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !username || !password}
          >
            <LockIcon size={16} />
            {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
            <ArrowRightIcon size={16} />
          </button>
        </form>

        <div className="login-hint">
          <UserIcon size={12} /> Demo: <b>belediye</b> / <b>1234</b>
        </div>
      </div>
    </div>
  );
}
