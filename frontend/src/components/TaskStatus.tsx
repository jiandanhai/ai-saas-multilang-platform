import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Task {
  id: number;
  file_path: string;
  status: string;
  asr_text?: string;
  translated_text?: string;
  tts_url?: string;
}

const TaskStatus: React.FC<{ taskId: number; token: string }> = ({ taskId, token }) => {
  const [task, setTask] = useState<Task | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!taskId) return;
    const fetchTask = async () => {
      try {
        const resp = await axios.get(`/api/task/${taskId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setTask(resp.data);
      } catch (e: any) {
        setError(e?.response?.data?.detail || '查询失败');
      }
    };
    fetchTask();
    const id = setInterval(fetchTask, 3000);
    return () => clearInterval(id);
  }, [taskId, token]);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!task) return <div className="text-gray-400">加载任务信息...</div>;

  return (
    <div className="border p-4 rounded shadow mt-4 bg-gray-50">
      <div>任务ID: {task.id}</div>
      <div>状态: <b>{task.status}</b></div>
      <div>ASR转写: <pre className="whitespace-pre-wrap">{task.asr_text}</pre></div>
      <div>翻译: <pre className="whitespace-pre-wrap">{task.translated_text}</pre></div>
      {task.tts_url && <audio src={`/${task.tts_url}`} controls className="mt-2" />}
    </div>
  );
};
export default TaskStatus;