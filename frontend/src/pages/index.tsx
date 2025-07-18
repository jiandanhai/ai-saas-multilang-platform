import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import UploadFile from "../components/UploadFile";
import TrialQuotaBanner from "../components/TrialQuotaBanner";
import api from "../api";

const IndexPage: React.FC = () => {
  const [token, setToken] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [quotaLeft, setQuotaLeft] = useState<number | null>(null);

  // 取 token/username（兼容未登录试用）
  useEffect(() => {
    const t = localStorage.getItem("token") || "";
    const u = localStorage.getItem("username") || "";
    setToken(t);
    setUsername(u);
  }, []);

  // 获取配额（未登录状态下也能获取）
  useEffect(() => {
    api.get("/user/trial_quota")
      .then(res => setQuotaLeft(res.data?.quotaLeft ?? null))
      .catch(() => setQuotaLeft(null));
  }, [token]);

  // 登出逻辑
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setToken("");
    setUsername("");
    window.location.href = "/";
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      {/* 顶部操作栏 */}
      <Header
        token={token}
        username={username}
        onLogout={handleLogout}
        quotaLeft={quotaLeft ?? undefined}
      />
      {/* 配额提示 Banner */}
      <TrialQuotaBanner quotaLeft={quotaLeft ?? undefined} />
      <main className="max-w-2xl mx-auto px-4 py-14 flex flex-col items-center">
        <section className="w-full bg-white/80 rounded-2xl shadow-xl p-10 animate-fadein">
          <h1 className="text-3xl font-extrabold text-brand mb-2 text-center">
            AI多语言智能平台
          </h1>
          <p className="mb-8 text-gray-500 text-center">
            立即体验多语种智能处理，试用额度用完请注册登录升级套餐。
          </p>
          <UploadFile token={token} quotaLeft={quotaLeft ?? undefined} />
        </section>
      </main>
    </div>
  );
};

export default IndexPage;
