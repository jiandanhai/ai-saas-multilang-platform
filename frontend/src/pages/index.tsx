import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import TrialQuotaBanner from "../components/TrialQuotaBanner";
import UploadFile from "../components/UploadFile";
import api from "../api";

const HomePage: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [quotaLeft, setQuotaLeft] = useState<number | undefined>(undefined);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    setUsername(localStorage.getItem("username"));
    api.get("/user/quota").then(res => setQuotaLeft(res.data.quotaLeft));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setToken(null);
    setUsername(null);
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-950">
      <Header username={username || undefined} onLogout={handleLogout} quotaLeft={quotaLeft} />
      <TrialQuotaBanner quotaLeft={quotaLeft} />
      <main className="flex flex-col items-center justify-center px-3 py-12">
        <img src="/icons/logo-512.png" alt="LinguaFlow" className="h-24 mt-8 mb-2" />
        <h1 className="text-4xl font-extrabold text-brand mb-4 text-center tracking-tight drop-shadow">
          AI多语种智能翻译平台
        </h1>
        <p className="mb-6 text-gray-500 text-center max-w-2xl text-lg">
          免费试用 · 上传音频/文档一键翻译 · 极速转写支持多语种 · 额度用完请注册/付费解锁更多功能
        </p>
        <UploadFile quotaLeft={quotaLeft} />
      </main>
    </div>
  );
};

export default HomePage;
