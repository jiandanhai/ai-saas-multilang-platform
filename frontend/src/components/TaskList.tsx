import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Task {
  id: number;
  file_path: string;
  status: string;
  asr_text?: string;
  translated_text?: string;
  tts_url?: string;
  created_at: string;
}

const TaskList: React.FC<{ token: string; onSelect: (taskId: number) => void }> = ({ token, onSelect }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    axios.get('/api/my_tasks', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(resp => setTasks(resp.data))
      .catch(e => setError(e?.response?.data?.detail || '加载任务失败'))
      .finally(() => setLoading(false));
  }, [token]);

  if (!token) return null;
  if (loading) return <div>加载中...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (tasks.length === 0) return <div>暂无任务</div>;

  return (
    <div className="mt-6 max-w-2xl w-full">
      <h3 className="font-bold mb-2">我的任务列表</h3>
      <table className="w-full border bg-white rounded shadow text-sm">
        <thead><tr className="bg-gray-100">
          <th className="p-2">ID</th>
          <th className="p-2">文件</th>
          <th className="p-2">状态</th>
          <th className="p-2">创建时间</th>
          <th className="p-2">操作</th>
        </tr></thead>
        <tbody>
          {tasks.map(t => (
            <tr key={t.id} className="border-t">
              <td className="p-2">{t.id}</td>
              <td className="p-2 max-w-[160px] truncate">{t.file_path}</td>
              <td className="p-2">{t.status}</td>
              <td className="p-2">{new Date(t.created_at).toLocaleString()}</td>
              <td className="p-2">
                <button
                  className="text-blue-600 underline"
                  onClick={() => onSelect(t.id)}
                >详情</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default TaskList;