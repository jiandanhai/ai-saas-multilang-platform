import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "../components/Header";
// 假设有API工具 fetchTasks/getTasks
import { fetchTasks } from "../api";

const TaskListPage: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
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
    fetchTasks(token).then(setTasks);
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setToken("");
    router.push("/login");
  };

  if (!token) return null;

  return (
    <>
      <Header onLogout={handleLogout} username={username} />
      <main className="max-w-2xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-extrabold text-brand mb-6">我的任务</h2>
        <div className="bg-white/90 rounded-2xl shadow-glass p-8">
          {tasks.length === 0 ? (
            <div className="text-center text-gray-400">暂无任务</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {tasks.map((task, idx) => (
                <li key={task.id || idx} className="py-4 flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
                  <span className="font-medium text-gray-800 flex-1 truncate">{task.filename}</span>
                  <span className={`px-3 py-1 rounded-xl text-xs font-bold ${task.status === 'completed' ? 'bg-green-100 text-green-700' : task.status === 'failed' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>{task.status === 'completed' ? '已完成' : task.status === 'processing' ? '处理中' : '失败'}</span>
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
