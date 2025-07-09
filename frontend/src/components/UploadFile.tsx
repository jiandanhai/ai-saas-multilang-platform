import React, { useRef, useState } from 'react';
import axios from 'axios';

interface UploadResponse { task_id: number; }

const UploadFile: React.FC<{ token: string }> = ({ token }) => {
  const fileInput = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async () => {
    const file = fileInput.current?.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append('file', file);
      await axios.post<UploadResponse>('/api/upload', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      // 上传成功后交由父组件 TaskList 自动刷新
    } catch (e: any) {
      setError(e?.response?.data?.detail || '上传失败');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-6 border rounded shadow max-w-xl mx-auto mt-8 bg-white">
      <input type="file" ref={fileInput} className="mb-2" />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={uploading}
        onClick={handleUpload}
      >{uploading ? '上传中...' : '上传文件'}</button>
      {error && <div className="mt-2 text-red-500">{error}</div>}
    </div>
  );
};
export default UploadFile;