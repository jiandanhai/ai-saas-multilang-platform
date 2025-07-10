import React, { useRef, useState } from 'react';
import { UploadCloud, Loader2, CheckCircle2, XCircle } from 'lucide-react';

interface UploadResponse { task_id: number; }
const UploadFile: React.FC<{ token: string; onFinish?: (taskId: number) => void }> = ({ token, onFinish }) => {
  const fileInput = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [taskId, setTaskId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const handleUpload = async () => {
    const file = fileInput.current?.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append('file', file);
      const resp = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!resp.ok) throw new Error((await resp.json()).detail || '上传失败');
      const data: UploadResponse = await resp.json();
      setTaskId(data.task_id);
      onFinish && onFinish(data.task_id);
    } catch (e: any) {
      setError(e?.message || '上传失败');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-xl w-full p-8 rounded-2xl shadow-xl bg-gradient-to-br from-white to-slate-100 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700">
      <div className="flex items-center gap-3 mb-5">
        <UploadCloud className="text-blue-600 dark:text-blue-400" size={32} />
        <span className="font-semibold text-lg">上传你的音视频文件</span>
      </div>
      <input
        type="file"
        ref={fileInput}
        className="mb-4 block w-full border rounded px-2 py-2 text-gray-700 dark:text-gray-100 bg-white dark:bg-slate-800"
        accept="audio/*,video/*"
        disabled={uploading}
      />
      <button
        className={`w-full py-2 rounded-xl font-bold transition 
          ${uploading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"} text-white`}
        disabled={uploading}
        onClick={handleUpload}
      >
        {uploading ? (
          <span className="flex items-center justify-center gap-2"><Loader2 className="animate-spin" /> 上传中...</span>
        ) : "上传文件"}
      </button>
      {taskId &&
        <div className="flex items-center gap-2 mt-4 text-green-600 dark:text-green-400">
          <CheckCircle2 /> 任务已提交！ID: <b>{taskId}</b>
        </div>
      }
      {error &&
        <div className="flex items-center gap-2 mt-4 text-red-600 dark:text-red-400">
          <XCircle /> {error}
        </div>
      }
      <div className="mt-6 text-xs text-gray-400 dark:text-gray-500">
        支持 MP3/MP4/WAV/M4A/WEBM/AVI 等常见格式，最大1GB
      </div>
    </div>
  );
};
export default UploadFile;
