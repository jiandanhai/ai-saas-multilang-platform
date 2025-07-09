import React, { useState } from 'react';
import UploadFile from '../components/UploadFile';

const UploadPage: React.FC = () => {
  const [token, setToken] = useState(''); // 实际可用全局Context
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <h1 className="text-xl font-bold my-4">上传新任务</h1>
      <UploadFile token={token} />
    </div>
  );
};
export default UploadPage;
