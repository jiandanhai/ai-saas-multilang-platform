// src/pages/index.tsx

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Header from "../components/Header";
import TrialQuotaBanner from "../components/TrialQuotaBanner";
import UploadFile from "../components/UploadFile";
import api from "../api";
import { AnimatePresence, motion } from "framer-motion";

// 正确 Promise 封装，保证返回数组
async function fetchTasks(token: string): Promise<any[]> {
  try {
    const res = await api.get("/tasks", {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data?.tasks || [];
  } catch (e) {
    return [];
  }
}

const HomePage: React.FC = () => {
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [tasks, setTasks] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const t = localStorage.getItem("token");
    const u = localStorage.getItem("username");
    if (!t) router.push("/login");
    else {
      setToken(t);
      setUsername(u || "用户");
    }
  }, [router]);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetchTasks(token)
      .then(setTasks)
      .catch(() => setTasks([]))
      .finally(() => setLoading(false));
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setToken("");
    router.push("/login");
  };

  if (!token) return null;

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 via-fuchsia-50 to-pink-50 dark:from-gray-900 dark:to-slate-900">
      <TrialQuotaBanner />
      <Header onLogout={handleLogout} username={username} />
      <main className="max-w-2xl mx-auto px-2 py-12 flex flex-col items-center gap-10">
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full rounded-2xl shadow-2xl border border-gray-200 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-10 mb-8 relative overflow-hidden"
        >
          <div className="absolute inset-0 pointer-events-none z-0" style={{ background: "radial-gradient(circle at 90% 20%,rgba(93,133,255,.08),transparent 60%)" }}></div>
          <h1 className="text-4xl font-extrabold bg-gradient-to-br from-blue-700 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent text-center mb-2 tracking-tight drop-shadow">AI多语言智能平台</h1>
          <p className="mb-10 text-base text-gray-500 text-center font-medium z-10 relative">免费体验多语言上传处理，配额用完后注册解锁更多功能。</p>
          <UploadFile token={token} />
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          className="w-full rounded-2xl shadow-lg border border-gray-100 bg-white/90 dark:bg-gray-900/80 p-8 backdrop-blur-md"
        >
          <h2 className="text-xl font-bold text-brand mb-3">我的任务</h2>
          {error && <div className="text-red-500 mb-2">{error}</div>}
          <AnimatePresence>
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center text-blue-400 py-10 text-lg animate-pulse"
              >
                任务加载中...
              </motion.div>
            ) : tasks.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center text-gray-400">暂无任务</motion.div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {tasks.map((task, idx) => (
                  <motion.li
                    key={task.id || idx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.06 + 0.1 }}
                    whileHover={{ scale: 1.02, boxShadow: "0 4px 24px 0 rgba(122,88,255,0.13)" }}
                    className="py-4 flex flex-col md:flex-row md:items-center gap-2 md:gap-8 bg-white/70 rounded-xl hover:shadow-xl duration-150"
                  >
                    <span className="font-medium text-gray-800 flex-1 truncate">{task.filename}</span>
                    <span className={`px-3 py-1 rounded-xl text-xs font-bold ${task.status === 'completed' ? 'bg-green-100 text-green-700' : task.status === 'failed' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>{task.status === 'completed' ? '已完成' : task.status === 'processing' ? '处理中' : '失败'}</span>
                    <span className="text-xs text-gray-400">{task.created_at ? new Date(task.created_at).toLocaleString() : ''}</span>
                    {task.status === 'completed' && task.result_url && (
                      <a href={task.result_url} target="_blank" rel="noopener" className="ml-4 text-brand underline font-bold">下载</a>
                    )}
                  </motion.li>
                ))}
              </ul>
            )}
          </AnimatePresence>
        </motion.section>
      </main>
    </div>
  );
};

export default HomePage;
