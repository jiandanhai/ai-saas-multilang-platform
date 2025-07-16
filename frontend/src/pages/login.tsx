import React, { useState } from "react";
import { useRouter } from "next/router";
import Header from "../components/Header";
import { loginUser } from "../api";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { token } = await loginUser(username, password);
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "登录失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-100 via-fuchsia-100 to-purple-100 animate-fadein">
      <Header />
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/80 dark:bg-slate-900/90 backdrop-blur-lg rounded-2xl shadow-xl px-10 py-10 mt-10 animate-slidein"
      >
        <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-fuchsia-500 to-violet-600 mb-6 text-center">登录 LinguaFlow</h2>
        <div className="mb-6">
          <input
            type="text"
            placeholder="用户名"
            className="w-full rounded-xl border border-gray-200 shadow-inner bg-white/80 p-3 focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-300 text-lg"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            autoFocus
          />
        </div>
        <div className="mb-6">
          <input
            type="password"
            placeholder="密码"
            className="w-full rounded-xl border border-gray-200 shadow-inner bg-white/80 p-3 focus:border-blue-400 focus:ring-2 focus:ring-blue-300 text-lg"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        {error && <div className="mb-4 text-red-500 text-sm text-center animate-shake">{error}</div>}
        <button
          type="submit"
          className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-fuchsia-500 to-blue-500 text-white font-bold shadow-lg hover:scale-105 transition-all text-lg mb-2 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "登录中..." : "登录"}
        </button>
        <div className="text-center mt-3 text-gray-500 dark:text-gray-400">
          没有账号？ <a href="/register" className="text-fuchsia-600 hover:underline font-bold">去注册</a>
        </div>
      </form>
    </div>
  );
};
export default LoginPage;
