import React, { useRef, useState } from "react";

interface UploadFileProps {
  token?: string;
  quotaLeft?: number;
}

const UploadFile: React.FC<UploadFileProps> = ({ token, quotaLeft }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [resultMsg, setResultMsg] = useState<string | null>(null);
  const [showRegisterPrompt, setShowRegisterPrompt] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 拖拽相关
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  // 文件选择
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) setFile(e.target.files[0]);
  };

  // 上传处理
  const handleUpload = async () => {
    if (!file) return;
    if (quotaLeft === 0) {
      setShowRegisterPrompt(true);
      return;
    }
    setLoading(true);
    setResultMsg(null);
    try {
      // 此处请替换为真实 API
      await new Promise((r) => setTimeout(r, 1500)); // 假上传
      setResultMsg("上传成功！您的任务已进入处理队列。");
    } catch (e) {
      setResultMsg("上传失败，请重试。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      {/* 上传卡片区 */}
      <div
        className={`w-full max-w-xl rounded-2xl bg-white dark:bg-slate-900/90 shadow-xl p-8 flex flex-col items-center border-2 border-dashed transition-all
         ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-200 dark:border-slate-700"}`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        tabIndex={0}
      >
        <div className="w-full flex flex-col items-center">
          <button
            type="button"
            className="w-28 h-28 flex items-center justify-center rounded-full border-4 border-blue-200 bg-blue-50 text-blue-600 shadow transition-all hover:scale-105 focus:ring-2 focus:ring-blue-400"
            onClick={() => inputRef.current?.click()}
            disabled={loading}
          >
            <svg className="w-14 h-14" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 48 48">
              <path d="M24 10v28M10 24h28" strokeLinecap="round" />
            </svg>
          </button>
          <input
            type="file"
            ref={inputRef}
            className="hidden"
            onChange={handleFileChange}
            disabled={loading}
          />
          <p className="text-gray-600 dark:text-gray-300 mt-5">
            {file ? <span>已选择文件：<b>{file.name}</b></span> : "拖拽文件到此 或 点击上方按钮选择"}
          </p>
        </div>
        <button
          className={`mt-6 px-8 py-2 rounded-lg bg-brand text-white font-bold text-lg shadow-md transition-all
            ${loading ? "bg-gray-300 dark:bg-slate-700 cursor-not-allowed animate-pulse" : "hover:bg-brand-dark"}`}
          onClick={handleUpload}
          disabled={!file || loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              正在上传...
            </span>
          ) : "上传文件"}
        </button>
      </div>
      {/* 上传结果/弹窗 */}
      {resultMsg && (
        <div className="fixed inset-0 flex items-center justify-center z-50 animate-fadein">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 border border-blue-200 text-lg font-medium text-center">
            {resultMsg}
            <button className="block mt-4 px-5 py-2 bg-brand text-white rounded shadow hover:bg-brand-dark" onClick={() => setResultMsg(null)}>关闭</button>
          </div>
          <div className="fixed inset-0 bg-black/40 z-0" onClick={() => setResultMsg(null)} />
        </div>
      )}
      {/* 额度用尽注册弹窗 */}
      {showRegisterPrompt && (
        <div className="fixed inset-0 flex items-center justify-center z-50 animate-fadein">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-6 border border-blue-200 text-center">
            <div className="text-xl font-bold text-red-600 mb-2">试用额度已用完！</div>
            <div className="mb-3 text-gray-600 dark:text-gray-200">
              注册/登录账号可继续使用全部功能，享更多配额与权益。
            </div>
            <a href="/register" className="inline-block px-5 py-2 bg-brand text-white rounded shadow hover:bg-brand-dark transition-all">
              立即注册
            </a>
            <button className="block mt-4 mx-auto text-gray-400 hover:underline" onClick={() => setShowRegisterPrompt(false)}>
              暂不注册
            </button>
          </div>
          <div className="fixed inset-0 bg-black/40 z-0" onClick={() => setShowRegisterPrompt(false)} />
        </div>
      )}
    </div>
  );
};

export default UploadFile;
