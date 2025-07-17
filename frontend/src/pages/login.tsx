import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "../components/Header";
import TrialQuotaBanner from "../components/TrialQuotaBanner";
import UploadFile from "../components/UploadFile";
import api from "../api";

const HomePage: React.FC = () => {
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [quotaLeft, setQuotaLeft] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const t = localStorage.getItem("token");
    const u = localStorage.getItem("username");
    setToken(t || "");
    setUsername(u || "试用用户");
    // 拉取配额（无论登录与否都能看见，未登录返回匿名quota）
    api.get("/user/quota")
      .then(res => setQuotaLeft(res.data?.quota_left ?? null))
      .catch(() => setQuotaLeft(null));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setToken("");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 animate-fadein">
      <TrialQuotaBanner quotaLeft={quotaLeft ?? undefined} />
      <Header username={username} onLogout={handleLogout} quotaLeft={quotaLeft ?? undefined} />
      <main className="max-w-2xl mx-auto px-4 py-12 flex flex-col items-center">
        <section className="w-full bg-white/80 rounded-2xl shadow-xl p-10">
          <h1 className="text-3xl font-extrabold text-brand mb-2 text-center">AI多语言智能平台</h1>
          <p className="mb-8 text-gray-500 text-center">免费体验上传与多语言处理，配额用完后注册解锁更多功能。</p>
          <UploadFile token={token} quotaLeft={quotaLeft ?? undefined} />
        </section>
      </main>
    </div>
  );
};

export default HomePage;
