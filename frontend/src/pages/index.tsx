import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import UploadFile from "../components/UploadFile";
import TrialQuotaBanner from "../components/TrialQuotaBanner";

const HomePage: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [quotaLeft, setQuotaLeft] = useState<number | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    setUsername(localStorage.getItem("username"));
    fetch("/api/user/quota")
      .then(res => res.json())
      .then(data => setQuotaLeft(data.quotaLeft ?? 0))
      .catch(() => setQuotaLeft(0));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setToken(null);
    setUsername(null);
    // window.location.reload(); // 或跳到首页
  };

  // SSR 阶段 token/quota 都是 null，等加载完再渲染主要UI
  if (token === null || quotaLeft === null) {
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
        <UploadFile token={token} quotaLeft={quotaLeft} />
      </main>
    </div>
  );
};

export default HomePage;
