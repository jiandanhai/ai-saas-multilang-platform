import React, { useEffect, useState } from 'react';
import { RefreshCw, AudioLines } from 'lucide-react';

interface Task {
  id: number;
  file_path: string;
  status: string;
  asr_text?: string;
  translated_text?: string;
  tts_url?: string;
}
const statusColor = (s: string) => {
  if (s === 'success') return "text-green-600 dark:text-green-400";
  if (s === 'failed') return "text-red-600 dark:text-red-400";
  return "text-blue-600 dark:text-blue-400";
};

const TaskStatus: React.FC<{ taskId: number; token: string }> = ({ taskId, token }) => {
  const [task, setTask] = useState<Task | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!taskId) return;
    let mounted = true;
    const fetchTask = async () => {
      try {
        const resp = await fetch(`/api/task/${taskId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!resp.ok) throw new Error((await resp.json()).detail || '查询失败');
        const data = await resp.json();
        if (mounted) setTask(data);
      } catch (e: any) {
        setError(e?.message || '查询失败');
      }
    };
    fetchTask();
    const id = setInterval(fetchTask, 3000);
    return () => { mounted = false; clearInterval(id); };
  }, [taskId, token]);

  if (error) return <div className="text-red-500">{error}</div>;
  if (!task) return <div className="text-gray-400 flex items-center gap-2"><RefreshCw className="animate-spin" />加载任务信息...</div>;

  return (
    <div className="border p-6 rounded-2xl shadow-lg mt-6 bg-white dark:bg-slate-900 max-w-xl w-full">
      <div className="flex gap-3 items-center mb-3">
        <AudioLines className="text-blue-600 dark:text-blue-400" />
        <div>
          <div className="text-gray-500 dark:text-gray-400">任务ID: <b className="text-black dark:text-white">{task.id}</b></div>
          <div className={statusColor(task.status) + " font-semibold"}>状态: {task.status}</div>
        </div>
      </div>
      <div className="mt-4">
        <div className="text-sm text-gray-400 mb-2">ASR转写结果：</div>
        <pre className="bg-gray-100 dark:bg-slate-800 p-2 rounded whitespace-pre-wrap text-sm">{task.asr_text || "——"}</pre>
      </div>
      <div className="mt-4">
        <div className="text-sm text-gray-400 mb-2">翻译内容：</div>
        <pre className="bg-gray-100 dark:bg-slate-800 p-2 rounded whitespace-pre-wrap text-sm">{task.translated_text || "——"}</pre>
      </div>
      {task.tts_url &&
        <div className="mt-4 flex flex-col">
          <span className="text-sm text-gray-400">TTS合成音频：</span>
          <audio src={`/${task.tts_url}`} controls className="mt-2 rounded-xl w-full" />
        </div>
      }
    </div>
  );
};
export default TaskStatus;
