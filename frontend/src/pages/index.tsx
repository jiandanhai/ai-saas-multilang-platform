import React, { useState } from 'react';
import RegisterForm from '../components/RegisterForm';
import LoginForm from '../components/LoginForm';
import UserProfile from '../components/UserProfile';
import UploadFile from '../components/UploadFile';
import TaskList from '../components/TaskList';
import TaskStatus from '../components/TaskStatus';

const HomePage: React.FC = () => {
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [taskId, setTaskId] = useState<number | null>(null);
  const [view, setView] = useState<'login' | 'register' | 'profile'>('login');

  const handleLogin = (token: string, username: string) => {
    setToken(token); setUsername(username); setView('profile');
  };
  const handleLogout = () => {
    setToken(''); setUsername(''); setView('login'); setTaskId(null);
  };
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <h1 className="text-2xl font-bold my-6">AI多语种短视频智能平台</h1>
      {token ? (
        <>
          <UserProfile username={username} onLogout={handleLogout} />
          <UploadFile token={token} />
          <TaskList token={token} onSelect={setTaskId} />
          {taskId && <TaskStatus taskId={taskId} token={token} />}
        </>
      ) : (
        <div className="w-full max-w-md">
          {view === 'login' ? (
            <>
              <LoginForm onLogin={handleLogin} />
              <div className="text-center mt-2">
                <button className="text-blue-600" onClick={() => setView('register')}>去注册</button>
              </div>
            </>
          ) : (
            <>
              <RegisterForm onSuccess={() => setView('login')} />
              <div className="text-center mt-2">
                <button className="text-blue-600" onClick={() => setView('login')}>已有账号？去登录</button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
export default HomePage;