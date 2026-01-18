import React, { useState } from "react";
import { User, Mail, Lock, KeyRound } from "lucide-react";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const RegisterPage: React.FC = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password !== form.confirmPassword) {
      setError("Password tidak sama.");
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/register`, {
        name: form.name,
        email: form.email,
        password: form.password,
        password_confirmation: form.confirmPassword,
      });
      setSuccess(res.data.message || "Registrasi berhasil! Silakan login.");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Registrasi Gagal. Silakan hubungi administrator"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-300">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-green-700 mb-6 text-center">
          Register Akun
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Lengkap
            </label>
            <div className="relative h-10">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-green-600">
                <User size={18} />
              </span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-1.5 border rounded focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative h-10">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-green-600">
                <Mail size={18} />
              </span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-1.5 border rounded focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative h-10">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-green-600">
                <Lock size={18} />
              </span>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-1.5 border rounded focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Konfirmasi Password
            </label>
            <div className="relative h-10">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-green-600">
                <KeyRound size={18} />
              </span>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-1.5 border rounded focus:outline-none focus:ring-2 focus:ring-green-400 text-sm"
                required
              />
            </div>
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <button
            type="submit"
            className="w-full py-2 bg-green-600 text-white font-semibold rounded hover:bg-green-700 transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
