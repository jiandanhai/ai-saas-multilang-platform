import React, { useState } from "react";
import { useRouter } from "next/router";
import api from "../api";
import Header from "../components/Header";

const Register: React.FC = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [codeLoading, setCodeLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // 验证码发送
  const sendCode = async () => {
    if (!email) return setError("请填写邮箱");
    setError("");
    setCodeLoading(true);
    try {
      await api.post("/user/send-verify-code", { email });
    } catch {
      setError("验证码发送失败，请稍后重试");
      setShake(true); setTimeout(() => setShake(false), 500);
    }
    setCodeLoading(false);
  };

  // 注册提交
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) {
      setError("请先同意服务协议");
      setShake(true); setTimeout(() => setShake(false), 500);
      return;
    }
    setLoading(true);
    setError("");
    try {
      await api.post("/user/register", { email, code, username, password });
      router.push("/login");
    } catch {
      setError("注册失败，请检查信息");
      setShake(true); setTimeout(() => setShake(false), 500);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand/10 to-frost flex flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center">
        <form
          className={`bg-white dark:bg-gray-900/80 p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 animate-fadein ${shake ? "animate-shake" : ""}`}
          onSubmit={handleRegister}
        >
          <h2 className="text-2xl font-bold text-brand text-center mb-4">注册新账号</h2>
          {error && <div className="text-red-500 text-sm mb-2 text-center">{error}</div>}
          <input className="w-full px-4 py-3 border rounded-lg bg-gray-50 dark:bg-gray-800 mb-3" placeholder="邮箱" value={email} onChange={e => setEmail(e.target.value)} />
          <div className="flex gap-2 mb-3">
            <input className="flex-1 px-4 py-3 border rounded-lg bg-gray-50 dark:bg-gray-800" placeholder="验证码" value={code} onChange={e => setCode(e.target.value)} />
            <button type="button" onClick={sendCode} className="px-3 py-1 rounded bg-brand text-white font-bold hover:bg-indigo-700 transition disabled:opacity-50" disabled={codeLoading}>
              {codeLoading ? "发送中..." : "获取验证码"}
            </button>
          </div>
          <input className="w-full px-4 py-3 border rounded-lg bg-gray-50 dark:bg-gray-800 mb-3" placeholder="用户名" value={username} onChange={e => setUsername(e.target.value)} />
          <input className="w-full px-4 py-3 border rounded-lg bg-gray-50 dark:bg-gray-800 mb-3" placeholder="密码" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <div className="flex items-center text-xs mb-3">
            <input type="checkbox" className="mr-2" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
            我已阅读并同意
            <a href="/terms" target="_blank" className="text-brand underline ml-1">服务协议</a>
          </div>
          <button className={`w-full py-3 rounded-xl font-bold bg-brand text-white hover:bg-indigo-700 transition mt-2 ${loading ? "opacity-50 cursor-wait" : ""}`} type="submit" disabled={loading}>
            {loading ? "注册中..." : "注册"}
          </button>
          <div className="flex gap-3 items-center mt-3 justify-center">
            <span className="text-gray-400 text-xs">第三方注册:</span>
            <button type="button" className="px-3 py-1 rounded border bg-white shadow hover:bg-frost">微信</button>
            <button type="button" className="px-3 py-1 rounded border bg-white shadow hover:bg-frost">Google</button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Register;
