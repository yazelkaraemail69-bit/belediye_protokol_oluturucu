/**
 * Basit oturum servisi. Şimdilik sabit bir demo kullanıcısıyla çalışır;
 * API bağlandığında `login` gerçek uç noktaya yönlendirilecek.
 */
export interface AuthUser {
  username: string;
  displayName: string;
}

const SESSION_KEY = "protokol.session";

// Demo amaçlı sabit kimlik bilgileri (API bağlanınca kaldırılacak).
const DEMO_USERS: Record<string, { password: string; displayName: string }> = {
  belediye: { password: "1234", displayName: "Belediye Çalışanı" },
};

export interface AuthService {
  login(username: string, password: string): Promise<AuthUser>;
  logout(): void;
  getCurrentUser(): AuthUser | null;
}

export class LocalAuthService implements AuthService {
  async login(username: string, password: string): Promise<AuthUser> {
    const record = DEMO_USERS[username.trim().toLowerCase()];
    if (!record || record.password !== password) {
      throw new Error("Kullanıcı adı veya şifre hatalı.");
    }
    const user: AuthUser = { username, displayName: record.displayName };
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    return user;
  }

  logout(): void {
    localStorage.removeItem(SESSION_KEY);
  }

  getCurrentUser(): AuthUser | null {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  }
}

export const authService: AuthService = new LocalAuthService();
