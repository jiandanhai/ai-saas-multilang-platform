import React, { useRef, useState } from "react";
import api from "../api";

interface UploadFileProps {
  token?: string;
  quotaLeft?: number;
  onUploaded?: () => void;
}

const UploadFile: React.FC<UploadFileProps> = ({ quotaLeft, onUploaded }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!fileInputRef.current?.files?.length) {
      setError("请选择要上传的文件");
      return;
    }
    setUploading(true);
    setProgress(0);
    const formData = new FormData();
    formData.append("file", fileInputRef.current.files[0]);
    try {
      const res = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: p => {
          setProgress(Math.round((p.loaded / (p.total || 1)) * 100));
        },
      });
      setSuccess("上传成功，正在处理…");
      setTimeout(() => setSuccess(""), 2500);
      onUploaded?.();
    } catch (err: any) {
      setError(err?.response?.data?.detail || "上传失败，请重试");
    }
    setUploading(false);
    setProgress(0);
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white/90 dark:bg-gray-900/90 rounded-2xl p-7 shadow-xl flex flex-col items-center space-y-3 border border-gray-100">
      <form className="flex flex-col w-full gap-3" onSubmit={handleUpload}>
        <input
          type="file"
          accept=".mp3,.wav,.txt,.docx"
          ref={fileInputRef}
          className="block w-full text-sm file:mr-3 file:px-4 file:py-2 file:rounded-lg file:border-0 file:bg-frost file:text-brand file:font-bold file:cursor-pointer"
        />
        {progress > 0 && uploading && (
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div
              className="bg-brand h-2 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
        <button
          type="submit"
          disabled={uploading || quotaLeft === 0}
          className={`py-3 rounded-xl font-bold bg-brand text-white transition-all shadow hover:bg-brand-dark mt-2 ${
            uploading || quotaLeft === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {uploading ? "上传中..." : quotaLeft === 0 ? "试用额度已用完" : "上传并翻译"}
        </button>
      </form>
      {error && <div className="w-full text-center text-sm text-red-500">{error}</div>}
      {success && <div className="w-full text-center text-green-600 text-sm animate-fadein">{success}</div>}
      <div className="w-full flex justify-end mt-1">
        <span className="text-xs text-gray-400">
          支持 mp3/wav/txt/docx
        </span>
      </div>
    </div>
  );
};

export default UploadFile;
