import React, { useEffect, useState } from 'react';
import UploadFile from '../components/UploadFile';
import TaskStatus from '../components/TaskStatus';
import { useRouter } from 'next/router';

const HomePage: React.FC = () => {
  const [token, setToken] = useState('');
  const [taskId, setTaskId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const t = localStorage.getItem('token');
    if (!t) router.push('/login');
    else setToken(t);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    router.push('/login');
  };

  if (!token) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center relative">
      {/* 顶部栏带退出按钮 */}
      <header className="w-full flex justify-between items-center py-6 px-8">
        <h1 className="text-2xl font-bold">AI多语种短视频智能平台</h1>
        <button
          className="bg-gray-500 hover:bg-gray-700 text-white px-4 py-1 rounded shadow"
          onClick={handleLogout}
        >
          退出登录
        </button>
      </header>
      {/* 页面主体 */}
      <UploadFile token={token} />
      {taskId && <TaskStatus taskId={taskId} token={token} />}
    </div>
  );
};
export default HomePage;
