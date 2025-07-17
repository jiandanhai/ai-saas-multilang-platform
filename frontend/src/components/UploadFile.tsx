import React, { useState } from "react";
import api from "../api";

interface UploadFileProps {
  token: string | null;
  quotaLeft: number | null;
}

const UploadFile: React.FC<UploadFileProps> = ({ token, quotaLeft }) => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const canUpload = (quotaLeft ?? 0) > 0 && token;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
    setMessage("");
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("请选择文件");
      return;
    }
    if (!canUpload) {
      setMessage("请登录或注册后上传，或试用额度已用完");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      // 可根据后端接口增加其它参数
      const { data } = await api.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setMessage(data.msg || "上传成功");
    } catch (error: any) {
      setMessage(error?.response?.data?.detail || "上传失败");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      <input
        type="file"
        className="file-input file-input-bordered file-input-primary w-full max-w-xs"
        onChange={handleChange}
        disabled={!canUpload}
      />
      <button
        className={`btn btn-primary w-full ${loading || !canUpload ? "opacity-50 cursor-not-allowed" : ""}`}
        disabled={loading || !canUpload}
        onClick={handleUpload}
      >
        {loading ? "上传中..." : "上传"}
      </button>
      {message && (
        <div className="w-full text-center text-sm text-gray-700">{message}</div>
      )}
      {!token && (
        <div className="text-xs text-gray-400 mt-2">
          未登录状态下仅可试用有限额度，<a className="underline text-brand" href="/register">注册/登录</a>可解锁全部功能
        </div>
      )}
    </div>
  );
};

export default UploadFile;
