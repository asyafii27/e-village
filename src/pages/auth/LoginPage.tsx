import type { FormEvent } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

interface LoginPageProps {
  onLoginSuccess: () => void;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const navigate = useNavigate();
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
      navigate("/"); // Redirect ke dashboard setelah login sukses
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="flex flex-col items-center mb-6">
          <div className="text-4xl mb-2">🏡</div>
          <h1 className="text-xl font-bold text-green-700">Sistem Manajemen Desa Sugihan</h1>
          <p className="text-sm text-gray-500">Kec. Winong, Kab. Pati, Jawa Tengah</p>
        </div>
        <p className="text-center text-gray-700 mb-4">
          Silakan masuk menggunakan email dan kata sandi untuk mengelola layanan dan data Desa Sugihan.
        </p>
        {error && <p className="text-red-500 text-sm text-center mb-2">{error}</p>}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="Masukkan email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kata sandi</label>
            <input
              type="password"
              placeholder="Masukkan kata sandi"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
          <Button
            type="submit"
            className="w-full py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition"
            disabled={loading}
          >
            {loading ? "Memproses..." : "Masuk ke Sistem"}
          </Button>
        </form>
        <div className="text-center mt-4">
          <a href="/register" className="text-green-600 hover:underline">Belum punya akun? Register di sini</a>
        </div>
      </div>
    </div>
  );
}
