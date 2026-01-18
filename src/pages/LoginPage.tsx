import type { FormEvent } from "react";
import { useState } from "react";
import axios from "axios";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";

interface LoginPageProps {
  onLoginSuccess: () => void;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await axios.post(`${API_BASE_URL}/api/login`, {
        email,
        password,
      });
      onLoginSuccess();
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Login gagal. Periksa kembali email dan kata sandi Anda.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Card className="login-card">
        <div className="login-hero">
          <div className="login-hero-icon">🏡</div>
          <div className="login-hero-text">
            <h1 className="login-hero-title">Sistem Manajemen Desa Sugihan</h1>
            <p className="login-hero-subtitle">Kec. Winong, Kab. Pati, Jawa Tengah</p>
          </div>
        </div>
        <p className="login-subtitle">
          Silakan masuk menggunakan email dan kata sandi untuk mengelola layanan dan data Desa Sugihan.
        </p>
        {error && <p className="login-error">{error}</p>}
        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-field">
            <span>Email</span>
            <input
              type="email"
              placeholder="Masukkan email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className="login-field">
            <span>Kata sandi</span>
            <input
              type="password"
              placeholder="Masukkan kata sandi"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          <Button
            type="submit"
            variant="primary"
            className="login-submit"
            disabled={loading}
          >
            {loading ? "Memproses..." : "Masuk ke Sistem"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
