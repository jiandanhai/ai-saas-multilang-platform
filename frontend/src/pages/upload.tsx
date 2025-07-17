import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Header from "../components/Header";
import TrialQuotaBanner from "../components/TrialQuotaBanner";
import UploadFile from "../components/UploadFile";


const UploadPage: React.FC = () => {
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const router = useRouter();
  //1. 增加配额状态
  const [quotaLeft, setQuotaLeft] = useState<number | null>(null);

  useEffect(() => {
    const t = localStorage.getItem("token") || "";
    setToken(t);

    // 拉取用户配额
    fetch("/api/user/quota", {
      headers: t ? { Authorization: `Bearer ${t}` } : {},
    })
      .then(res => res.json())
      .then(data => setQuotaLeft(data.quotaLeft ?? 0))
      .catch(() => setQuotaLeft(0));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setToken("");
    router.push("/login");
  };

  if (!token) return null;

  return (
    <>
      <TrialQuotaBanner />
     <Header username={username} onLogout={handleLogout} quotaLeft={quotaLeft} />
      <main className="max-w-xl mx-auto px-4 py-12 flex flex-col items-center">
        <section className="w-full bg-frost/80 backdrop-blur-2xl rounded-2xl shadow-glass p-10">
          <h2 className="text-2xl font-bold text-brand mb-3 text-center">上传文件</h2>
          <p className="mb-6 text-gray-500 text-center">支持多语种识别与智能翻译，安全私密。</p>
            <UploadFile token={token} quotaLeft={quotaLeft} />
        </section>
      </main>
    </>
  );
};
export default UploadPage;
