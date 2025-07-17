import React, { useState } from "react";
import { useRouter } from "next/router";
import api from "../api";
import Link from "next/link";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [agreement, setAgreement] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const router = useRouter();

  // 发送验证码
  const handleSendCode = async () => {
    if (!email) {
      setError("请输入邮箱");
      return;
    }
    setError("");
    setSending(true);
    try {
      await api.post("/user/send_code", { email });
      setSuccess("验证码已发送，请查收邮箱");
    } catch (e: any) {
      setError(e?.response?.data?.detail || "验证码发送失败");
    }
    setSending(false);
  };

  // 提交注册
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!agreement) {
      setError("请同意服务协议");
      return;
    }
    setLoading(true);
    try {
      await api.post("/user/register", { username, email, code, password });
      setSuccess("注册成功，请登录");
      setTimeout(() => router.push("/login"), 1200);
    } catch (e: any) {
      setError(e?.response?.data?.detail || "注册失败");
    }
    setLoading(false);
  };

  return (
    <main className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 items-center justify-center animate-fadein">
      <form
        className="bg-white/90 rounded-2xl p-8 shadow-2xl w-full max-w-md space-y-6 backdrop-blur-md"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-extrabold text-center text-brand">账号注册</h1>
        <div className="space-y-4">
          <input
            type="email"
            className="input w-full"
            placeholder="邮箱"
            autoComplete="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <div className="flex gap-2">
            <input
              type="text"
              className="input flex-1"
              placeholder="验证码"
              value={code}
              onChange={e => setCode(e.target.value)}
              required
            />
            <button
              type="button"
              className={`btn btn-sm ${sending ? "opacity-50 pointer-events-none" : ""}`}
              onClick={handleSendCode}
              disabled={sending}
            >
              {sending ? "发送中..." : "获取验证码"}
            </button>
          </div>
          <input
            type="text"
            className="input w-full"
            placeholder="用户名"
            autoComplete="username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            className="input w-full"
            placeholder="密码"
            autoComplete="new-password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <label className="flex items-center gap-2 text-xs text-gray-600 mt-2">
          <input
            type="checkbox"
            checked={agreement}
            onChange={e => setAgreement(e.target.checked)}
          />
          我已阅读并同意
          <Link href="/terms" className="underline text-brand ml-1" target="_blank">服务协议</Link>
        </label>
        {error && <div className="text-red-500 text-xs text-center">{error}</div>}
        {success && <div className="text-green-500 text-xs text-center">{success}</div>}
        <button
          type="submit"
          className={`btn w-full mt-2 ${loading ? "opacity-60 pointer-events-none" : ""}`}
          disabled={loading}
        >
          {loading ? "注册中…" : "注册"}
        </button>
        <div className="text-center text-xs mt-2 text-gray-500">
          已有账号？<Link href="/login" className="underline text-brand ml-1">登录</Link>
        </div>
      </form>
    </main>
  );
};

export default Register;
