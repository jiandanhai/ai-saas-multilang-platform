import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "../components/Header";
import TrialQuotaBanner from "../components/TrialQuotaBanner";
import UploadFile from "../components/UploadFile";
import api from "../api";

const HomePage: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string>("");
  const [quotaLeft, setQuotaLeft] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 1. 检查登录状态
  useEffect(() => {
    const t = localStorage.getItem("token");
    const u = localStorage.getItem("username");
    setToken(t);
    setUsername(u || "");
  }, []);

  // 2. 获取剩余额度
  useEffect(() => {
    api.get("/user/trial_quota")
      .then((res) => setQuotaLeft(res.data.quota_left))
      .catch(() => setQuotaLeft(0))
      .finally(() => setLoading(false));
  }, []);

  // 3. 退出
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setToken(null);
    setUsername("");
    router.push("/login");
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <TrialQuotaBanner quotaLeft={quotaLeft ?? undefined} />
      <Header token={token} username={username} onLogout={handleLogout} />
      <main className="max-w-2xl mx-auto px-4 py-14 flex flex-col items-center">
        <section className="w-full bg-white/80 rounded-2xl shadow-xl p-10 animate-fadein">
          <h1 className="text-3xl font-extrabold text-brand mb-2 text-center">AI多语言智能平台</h1>
          <p className="mb-6 text-gray-600 text-center">试用配额剩余 <span className="text-indigo-700 font-semibold">{quotaLeft ?? "--"}</span> 次</p>
          <UploadFile token={token} quotaLeft={quotaLeft} />
          {loading && (
            <div className="w-full flex justify-center mt-6">
              <span className="animate-spin text-brand">加载中…</span>
            </div>
          )}
          {quotaLeft !== null && quotaLeft <= 0 && (
            <div className="w-full text-center text-red-600 mt-6">
              试用额度已用完，请 <a className="underline text-brand" href="/register">注册/登录</a> 解锁更多功能
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default HomePage;
