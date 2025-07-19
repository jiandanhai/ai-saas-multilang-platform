// index.tsx
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import UploadFile from "../components/UploadFile";
import TrialQuotaBanner from "../components/TrialQuotaBanner";

const HomePage: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [quotaLeft, setQuotaLeft] = useState<number | null>(null);
  const [quotaError, setQuotaError] = useState<string | null>(null);

  useEffect(() => {
  const t = localStorage.getItem("token");
  setToken(t);
  setUsername(localStorage.getItem("username"));

  fetch("/api/user/quota", {
    headers: t ? { Authorization: `Bearer ${t}` } : undefined,
  })
    .then(async (res) => {
      if (res.ok) {
        const data = await res.json();
        setQuotaLeft(data.quotaLeft ?? 0);
      } else if (res.status === 402) {
        setQuotaLeft(0);
        setQuotaError("您的试用额度已用完，请注册或升级套餐。");
      } else {
        setQuotaLeft(0);
        setQuotaError("配额查询失败，请稍后重试。");
      }
    })
    .catch(() => {
      setQuotaLeft(0);
      setQuotaError("配额接口异常，请检查网络。");
    });
}, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setToken(null);
    setUsername(null);
  };

  if (quotaLeft === null) {
    // 首次进入还没拉到数据，展示loading
    return (
      <div className="flex justify-center items-center h-screen text-xl">Loading...</div>
    );
  }

  return (
    <div>
      <Header token={token} username={username} onLogout={handleLogout} quotaLeft={quotaLeft} />
      <TrialQuotaBanner quotaLeft={quotaLeft} />
      <main className="max-w-3xl mx-auto px-4 py-14 flex flex-col items-center">
        <img src="/icons/logo-512.png" alt="LinguaFlow" className="h-24 mt-8 mb-2" />
        <h1 className="text-3xl font-extrabold text-brand mb-2 text-center">AI多语言智能平台</h1>
        <p className="mb-8 text-gray-500 text-center">免费试用配额，额度用完后注册解锁更多功能。</p>
        {quotaError && (
          <div className="mb-4 text-red-500">{quotaError}</div>
        )}
        <UploadFile token={token} quotaLeft={quotaLeft} disabled={!!quotaError} />
      </main>
    </div>
  );
};

export default HomePage;
