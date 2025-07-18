import React, { useState } from "react";
import Link from "next/link";
import api from "../api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("请输入邮箱和密码");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/user/login", { email, password });
      localStorage.setItem("token", res.data.token);
      window.location.href = "/";
    } catch (e: any) {
      setError(e?.response?.data?.msg || "登录失败");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md bg-white/80 rounded-2xl shadow-2xl p-10 flex flex-col gap-6 animate-fadein">
        <h1 className="text-3xl font-extrabold text-center bg-gradient-to-r from-blue-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent mb-2">AI多语言智能平台</h1>
        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          <input
            className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-fuchsia-400 outline-none transition"
            placeholder="邮箱"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
          />
          <input
            className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-fuchsia-400 outline-none transition"
            placeholder="密码"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          {error && (
            <div className="text-red-500 text-center text-sm font-bold animate-shake">{error}</div>
          )}
          <button
            className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 via-fuchsia-500 to-pink-500 text-white font-bold shadow-md hover:scale-105 transition disabled:opacity-60"
            type="submit"
            disabled={loading}
          >
            {loading ? "登录中..." : "登录"}
          </button>
        </form>
        <div className="flex flex-col gap-2 text-center text-sm text-gray-500">
          <span>
            没有账号？
            <Link href="/register" className="text-fuchsia-600 ml-1 font-bold hover:underline">
              注册
            </Link>
          </span>
          <span>
            忘记密码？<a className="text-blue-500 hover:underline cursor-pointer" href="#">重置</a>
          </span>
        </div>
        <div className="flex items-center justify-center gap-4 my-2">
          <span className="h-px bg-gray-200 flex-1" />
          <span className="text-xs text-gray-400">或</span>
          <span className="h-px bg-gray-200 flex-1" />
        </div>
        <div className="flex justify-center gap-3">
          {/* 可集成三方登录：Google/微信/钉钉等 */}
          <button className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center shadow">
            <img src="/google-icon.svg" alt="Google" className="w-6 h-6" />
          </button>
          {/* <button className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center shadow">
            <img src="/wechat-icon.svg" alt="微信" className="w-6 h-6" />
          </button> */}
        </div>
      </div>
    </div>
  );
}
