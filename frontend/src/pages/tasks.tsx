// src/pages/tasks.tsx

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "../components/Header";
import { fetchTasks } from "../api"; // 你index.ts里已导出fetchTasks

const TaskListPage: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");
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
    // fetchTasks 兼容多种返回格式
    fetchTasks({ page, status })
      .then((resp: any) => {
        // 兼容各种返回格式
        if (Array.isArray(resp)) return setTasks(resp);
        if (resp && Array.isArray(resp.items)) return setTasks(resp.items);
        if (resp && resp.data && Array.isArray(resp.data.items)) return setTasks(resp.data.items);
        if (resp && resp.data && Array.isArray(resp.data)) return setTasks(resp.data);
        setTasks([]); // fallback
      })
      .catch(() => setTasks([]))
      .finally(() => setLoading(false));
  }, [token, page, status]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setToken("");
    router.push("/login");
  };

  return (
    <>
      <Header onLogout={handleLogout} username={username} />
      <main className="max-w-3xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-extrabold text-brand">我的任务</h2>
          <div className="flex gap-3">
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="rounded-lg border px-2 py-1 shadow focus:outline-none focus:ring-2 focus:ring-brand/40"
            >
              <option value="all">全部状态</option>
              <option value="processing">处理中</option>
              <option value="completed">已完成</option>
              <option value="failed">失败</option>
            </select>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="px-3 py-1 rounded bg-white border shadow"
              disabled={page === 1}
            >上一页</button>
            <span className="px-2">第 {page} 页</span>
            <button
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1 rounded bg-white border shadow"
            >下一页</button>
          </div>
        </div>
        <div className="bg-white/90 rounded-2xl shadow-glass p-8 min-h-[220px]">
          {loading ? (
            <div className="text-center text-brand animate-pulse py-10">加载中...</div>
          ) : tasks.length === 0 ? (
            <div className="text-center text-gray-400">暂无任务</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {tasks.map((task, idx) => (
                <li key={task.id || idx} className="py-4 flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
                  <span className="font-medium text-gray-800 flex-1 truncate">{task.filename || task.name || `任务 #${task.id}`}</span>
                  <span className={`px-3 py-1 rounded-xl text-xs font-bold ${task.status === 'completed' ? 'bg-green-100 text-green-700' : task.status === 'failed' ? 'bg-red-100 text-red-600' : task.status === 'processing' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'}`}>{task.status === 'completed' ? '已完成' : task.status === 'processing' ? '处理中' : task.status === 'failed' ? '失败' : task.status}</span>
                  <span className="text-xs text-gray-400">{task.created_at ? new Date(task.created_at).toLocaleString() : ''}</span>
                  {task.status === 'completed' && task.result_url && (
                    <a href={task.result_url} target="_blank" rel="noopener" className="ml-4 text-brand underline font-bold">下载</a>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </>
  );
};

export default TaskListPage;
