// UploadFile.tsx
import React, { useState } from "react";
import { PaperClipIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

export interface UploadFileProps {
  token?: string;
  quotaLeft?: number;
  disabled?: boolean;
}

const UploadFile: React.FC<UploadFileProps> = ({ token, quotaLeft, disabled = false }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
    setResult(null);
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) return setError("请先选择要上传的文件");
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/user/upload", {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setResult("文件上传并处理成功！");
        setFile(null);
      } else {
        setError(data.message || "上传失败，请重试");
      }
    } catch (e) {
      setError("网络异常，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full max-w-xl mx-auto bg-white dark:bg-gray-900/80 rounded-3xl shadow-2xl p-8 mt-4 animate-fadein flex flex-col items-center relative">
      <h2 className="text-xl font-bold mb-3 text-center text-brand dark:text-indigo-300">上传文档体验多语种智能转换</h2>
      <label className="w-full flex flex-col items-center cursor-pointer my-4">
        <input
          type="file"
          accept=".doc,.docx,.pdf,.md,.txt,.jpg,.png,.jpeg"
          onChange={handleFileChange}
          className="hidden"
          disabled={loading || (quotaLeft !== undefined && quotaLeft <= 0)}
        />
        <div className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl px-6 py-8 transition-all ${file ? 'border-green-400 bg-green-50 dark:bg-green-900/20' : 'border-gray-300 hover:border-indigo-500 bg-gray-50 dark:bg-gray-800/60'} ${loading ? 'opacity-70' : ''}`}>
          <PaperClipIcon className="w-10 h-10 text-indigo-400 mb-2" />
          <span className="font-medium text-gray-500 dark:text-gray-200">{file ? file.name : "点击或拖拽上传文件"}</span>
        </div>
      </label>
      <button
        className={`w-full py-3 mt-4 text-lg font-bold rounded-xl shadow-md transition bg-brand text-white hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed ${loading ? 'animate-pulse' : ''}`}
        disabled={loading || !file || (quotaLeft !== undefined && quotaLeft <= 0)}
        onClick={handleUpload}
      >
        {loading ? "上传中..." : (quotaLeft === 0 ? "额度已用尽" : "立即上传并处理")}
      </button>
      {(result || error) && (
        <div className={`flex flex-col items-center mt-4 px-4 py-3 rounded-xl shadow-lg bg-white dark:bg-gray-800 border ${result ? 'border-green-400' : 'border-red-400'} animate-popin`}>
          {result && <CheckCircleIcon className="w-8 h-8 text-green-500 mb-1" />}
          {error && <XCircleIcon className="w-8 h-8 text-red-500 mb-1" />}
          <div className="text-center font-medium text-lg text-gray-800 dark:text-gray-100">{result || error}</div>
        </div>
      )}
      {quotaLeft !== undefined && quotaLeft <= 1 && (
        <div className="mt-3 px-3 py-2 rounded-lg bg-orange-100 text-orange-700 font-bold animate-shake">
          剩余额度仅剩 <span className="text-red-500 font-extrabold">{quotaLeft}</span> 次！注册升级可获得更多。
        </div>
      )}
    </section>
  );
};

export default UploadFile;
