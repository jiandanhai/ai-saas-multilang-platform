import React, { useState } from "react";
import { useRouter } from "next/router";
import api from "../api";
import Header from "../components/Header";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data } = await api.post("/user/login", { username, password });
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", username);
      router.push("/");
    } catch (err: any) {
      setError("登录失败，账号或密码错误");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand/10 to-frost flex flex-col">
      <Header />
      <main className="flex flex-1 items-center justify-center">
        <form
          className={`bg-white dark:bg-gray-900/80 p-10 rounded-2xl shadow-xl w-full max-w-md space-y-6 border border-gray-100 animate-fadein ${shake ? "animate-shake" : ""}`}
          onSubmit={handleLogin}
        >
          <h2 className="text-2xl font-bold text-brand text-center mb-4">欢迎登录</h2>
          {error && <div className="text-red-500 text-sm mb-2 text-center">{error}</div>}
          <input
            className="w-full px-4 py-3 border rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-brand focus:outline-none"
            placeholder="用户名/邮箱/手机号"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoFocus
          />
          <input
            className="w-full px-4 py-3 border rounded-lg bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-brand focus:outline-none"
            placeholder="密码"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <div className="flex justify-between items-center text-xs text-gray-400">
            <span>
              登录即同意
              <a href="/terms" className="text-brand underline ml-1" target="_blank">服务协议</a>
            </span>
            <a href="/register" className="text-brand underline">还没有账号？注册</a>
          </div>
          <button
            className={`w-full py-3 rounded-xl font-bold bg-brand text-white hover:bg-indigo-700 transition mt-2 ${loading ? "opacity-50 cursor-wait" : ""}`}
            type="submit"
            disabled={loading}
          >
            {loading ? "登录中..." : "登录"}
          </button>
          <div className="flex gap-3 items-center mt-3 justify-center">
            <span className="text-gray-400 text-xs">第三方登录:</span>
            <button type="button" className="px-3 py-1 rounded border bg-white shadow hover:bg-frost">微信</button>
            <button type="button" className="px-3 py-1 rounded border bg-white shadow hover:bg-frost">Google</button>
            {/* ...可拓展 */}
          </div>
        </form>
      </main>
    </div>
  );
};
export default Login;
