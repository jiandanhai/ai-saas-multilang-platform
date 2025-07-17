import React, { useState } from "react";
import { useRouter } from "next/router";
import { registerUser, sendVerifyCode } from "../api/index";
import Link from "next/link";

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  // 发送验证码
  const handleSendCode = async () => {
    setSending(true);
    setError("");
    try {
      const res = await sendVerifyCode(email);
      setSent(true);
      setError(res.success ? "验证码已发送到邮箱" : res.message);
    } catch (e: any) {
      setError("验证码发送失败，请检查邮箱地址");
    }
    setSending(false);
  };

  // 注册提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!agreed) {
      setError("请先阅读并同意服务协议");
      return;
    }
    try {
      await registerUser({
        username, password, email, verify_code: verifyCode, agreed,
      });
      setSuccess(true);
      setTimeout(() => router.push("/login"), 1800);
    } catch (e: any) {
      setError(e?.response?.data?.detail || "注册失败，请检查信息");
    }
  };

  return (
    <main className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 items-center justify-center animate-fadein">
      <form
        className="bg-white/90 rounded-2xl p-8 shadow-2xl w-full max-w-md space-y-6 backdrop-blur-md"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-extrabold text-center text-brand">注册新账号</h1>
        <div className="space-y-3">
          <input type="text" className="input w-full" autoComplete="username"
            placeholder="用户名" value={username}
            onChange={e => setUsername(e.target.value)} required />
          <div className="flex gap-2">
            <input type="email" className="input flex-1" placeholder="邮箱"
              autoComplete="email"
              value={email} onChange={e => setEmail(e.target.value)} required />
            <button type="button"
              className={`btn text-xs ${sending ? "opacity-60" : ""}`}
              onClick={handleSendCode} disabled={sending || !email}>
              {sent ? "重新发送" : "获取验证码"}
            </button>
          </div>
          <input type="text" className="input w-full" placeholder="验证码"
            value={verifyCode} onChange={e => setVerifyCode(e.target.value)} required />
          <input type="password" className="input w-full" autoComplete="new-password"
            placeholder="密码" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
        </div>
        <label className="flex items-center gap-2 text-xs text-gray-600">
          <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} required />
          我已阅读并同意
          <Link href="/terms" target="_blank" className="underline text-brand hover:text-indigo-800 ml-1">服务协议</Link>
        </label>
        {error && <div className="text-sm text-red-500">{error}</div>}
        <button type="submit"
          className={`btn w-full mt-1 ${!agreed ? "opacity-40 pointer-events-none" : ""}`}>
          注册
        </button>
        {success && <div className="text-green-600 text-center mt-2">注册成功，正在跳转…</div>}
        <div className="text-center text-xs mt-2">
          已有账号？<Link href="/login" className="underline text-brand">登录</Link>
        </div>
      </form>
    </main>
  );
};

export default Register;
