import React, { useRef, useState } from "react";

interface UploadFileProps {
  token?: string | null;
  quotaLeft?: number | null;
  disabled?: boolean;
}

const UploadFile: React.FC<UploadFileProps> = ({ token, quotaLeft }) => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // SSR 时 quotaLeft 可能为 undefined，直接渲染 loading
  if (typeof quotaLeft !== "number") return <div className="py-8 text-center">Loading...</div>;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
    setMessage("");
  };

  const handleUpload = async () => {
    if (!file) return setMessage("请先选择文件！");
    if (quotaLeft <= 0) return setMessage("免费试用额度已用完，请注册/升级套餐！");
    setLoading(true);
    setMessage("");
    try {
      // 伪代码，替换为你的上传API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMessage("上传成功！");
    } catch (err) {
      setMessage("上传失败");
    }
    setLoading(false);
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-xl shadow px-8 py-6 mt-8">
      <div className="flex flex-col gap-4 items-center">
        <input
          type="file"
          ref={inputRef}
          className="border rounded p-2 w-full"
          onChange={handleFileChange}
          disabled={loading || quotaLeft <= 0}
        />
        <button
          onClick={handleUpload}
          className="bg-brand text-white px-6 py-2 rounded font-bold hover:bg-brand-dark transition"
          disabled={loading || quotaLeft <= 0}
        >
          {loading ? "上传中..." : "上传"}
        </button>
        {message && <div className="text-center text-sm text-brand">{message}</div>}
      </div>
    </div>
  );
};

export default UploadFile;
