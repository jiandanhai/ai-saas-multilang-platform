import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import UploadFile from "../components/UploadFile";
import TrialQuotaBanner from "../components/TrialQuotaBanner";
import api from "../api";

const IndexPage: React.FC = () => {
  const [token, setToken] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [quotaLeft, setQuotaLeft] = useState<number | null>(null);

  // 兼容未登录体验
  useEffect(() => {
    setToken(localStorage.getItem("token") || "");
    setUsername(localStorage.getItem("username") || "");
  }, []);

  // 获取配额
  useEffect(() => {
    api.get("/user/trial_quota")
      .then(res => setQuotaLeft(res.data?.quotaLeft ?? null))
      .catch(() => setQuotaLeft(null));
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setToken("");
    setUsername("");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-100 to-purple-50 dark:from-slate-900 dark:to-slate-800 transition-colors duration-500 flex flex-col">
      {/* Header 保留全部原有导航与功能 */}
      <Header
        token={token}
        username={username}
        onLogout={handleLogout}
        quotaLeft={quotaLeft ?? undefined}
      />
      {/* 配额提示Banner，保留 */}
      <TrialQuotaBanner quotaLeft={quotaLeft ?? undefined} />

      {/* 主体内容，品牌LOGO、标题、副标题、上传表单 */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 pb-8 pt-4 relative z-10">
        {/* LOGO区：如有 logo-512.png 会展示，没有不影响布局 */}
        <img
          src="/icons/logo-512.png"
          alt="LinguaFlow"
          className="h-24 w-24 mb-4 mt-8 drop-shadow-md rounded-2xl bg-white/60 object-contain border border-gray-200"
          style={{ display: "block" }}
        />
        <section className="w-full max-w-2xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl p-8 md:p-12 flex flex-col items-center animate-fadein">
          <h1 className="text-3xl md:text-4xl font-extrabold text-brand mb-2 text-center drop-shadow">
            AI多语言智能平台
          </h1>
          <p className="mb-8 text-gray-500 dark:text-gray-300 text-center text-base md:text-lg">
            极速试用文件/语音转多语言。<span className="font-semibold text-brand">新用户赠送免费额度</span>，用完需注册登录升级套餐解锁全部功能。
          </p>
          <div className="w-full flex flex-col items-center">
            <UploadFile token={token} quotaLeft={quotaLeft ?? undefined} />
          </div>
        </section>
      </main>
      {/* 可选背景动效层 */}
      {/*
      <div className="fixed inset-0 pointer-events-none opacity-30 z-0">
        <div className="absolute left-1/3 top-0 w-80 h-80 bg-indigo-200 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute right-1/4 bottom-0 w-56 h-56 bg-blue-100 rounded-full blur-3xl animate-pulse"></div>
      </div>
      */}
    </div>
  );
};

export default IndexPage;
