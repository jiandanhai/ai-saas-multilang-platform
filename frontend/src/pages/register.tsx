import React, { useState } from "react";
import Link from "next/link";
import api from "../api";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);

  const [sending, setSending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 发送验证码
  async function handleSendCode() {
    setError("");
    if (!email.match(/^[\w\-\.]+@[\w\-]+\.[a-zA-Z]{2,}$/)) {
      setError("请输入有效邮箱！");
      return;
    }
    setSending(true);
    try {
      await api.post("/user/send-verify-code", { email });
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setSending(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (e: any) {
      setError(e?.response?.data?.msg || "验证码发送失败！");
      setSending(false);
    }
  }

  // 注册
  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email || !username || !password || !code) {
      setError("请填写全部信息");
      return;
    }
    if (!agreed) {
      setError("请先同意服务协议");
      return;
    }
    setLoading(true);
    try {
      await api.post("/user/register", { email, code, username, password });
      window.location.href = "/login";
    } catch (e: any) {
      setError(e?.response?.data?.msg || "注册失败");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-pink-50">
      <div className="w-full max-w-md bg-white/80 rounded-2xl shadow-2xl p-10 flex flex-col gap-6 animate-fadein">
        <h1 className="text-3xl font-extrabold text-center bg-gradient-to-r from-blue-600 via-fuchsia-600 to-pink-600 bg-clip-text text-transparent mb-2">账号注册</h1>
        <form className="flex flex-col gap-4" onSubmit={handleRegister}>
          <input
            className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-fuchsia-400 outline-none transition"
            placeholder="邮箱"
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete="email"
          />
          <div className="flex gap-2">
            <input
              className="flex-1 px-4 py-2 rounded-lg border focus:ring-2 focus:ring-fuchsia-400 outline-none transition"
              placeholder="验证码"
              value={code}
              onChange={e => setCode(e.target.value)}
            />
            <button
              type="button"
              disabled={sending || countdown > 0}
              onClick={handleSendCode}
              className="px-3 py-2 rounded-lg bg-fuchsia-500 text-white hover:bg-fuchsia-600 font-bold shadow-md transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {countdown > 0 ? `${countdown}秒后重发` : "获取验证码"}
            </button>
          </div>
          <input
            className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-fuchsia-400 outline-none transition"
            placeholder="用户名"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoComplete="username"
          />
          <input
            className="px-4 py-2 rounded-lg border focus:ring-2 focus:ring-fuchsia-400 outline-none transition"
            placeholder="密码"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          <label className="flex items-center gap-2 text-gray-600 text-sm select-none">
            <input
              type="checkbox"
              className="accent-fuchsia-500"
              checked={agreed}
              onChange={e => setAgreed(e.target.checked)}
            />
            我已阅读并同意
            <a href="/terms" className="text-fuchsia-600 hover:underline ml-1" target="_blank">服务协议</a>
          </label>
          {error && (
            <div className="text-red-500 text-center text-sm font-bold animate-shake">{error}</div>
          )}
          <button
            className="w-full py-2 rounded-lg bg-gradient-to-r from-blue-500 via-fuchsia-500 to-pink-500 text-white font-bold shadow-md hover:scale-105 transition disabled:opacity-60"
            type="submit"
            disabled={loading}
          >
            {loading ? "注册中..." : "注册"}
          </button>
        </form>
        <div className="text-center text-sm text-gray-500">
          已有账号？
          <Link href="/login" className="text-fuchsia-600 ml-1 font-bold hover:underline">
            登录
          </Link>
        </div>
      </div>
    </div>
  );
}
