import { useState } from "react";
import "./App.css";
import { Login } from "./components/Login";
import { ProtocolApp } from "./components/ProtocolApp";
import { authService, type AuthUser } from "./services/authService";

export default function App() {
  const [user, setUser] = useState<AuthUser | null>(() =>
    authService.getCurrentUser()
  );

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <ProtocolApp
      user={user}
      onLogout={() => {
        authService.logout();
        setUser(null);
      }}
    />
  );
}
