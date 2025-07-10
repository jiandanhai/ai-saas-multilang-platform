import React, { useState } from 'react';
import { useRouter } from 'next/router';
import api from '../api';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await api.post('/login', { username, password });
      localStorage.setItem('token', res.data.access_token);
      router.push('/');
    } catch (e: any) {
      setErr(e?.response?.data?.detail || '登录失败');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200">
      <form className="bg-white rounded-2xl shadow p-8 w-full max-w-sm" onSubmit={handleLogin}>
        <h2 className="font-bold text-xl mb-6 text-center">登录账号</h2>
        <input className="block w-full mb-3 p-2 border rounded" placeholder="用户名"
          value={username} onChange={e => setUsername(e.target.value)} />
        <input className="block w-full mb-5 p-2 border rounded" placeholder="密码" type="password"
          value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-bold">登录</button>
        {err && <div className="mt-2 text-red-500">{err}</div>}
        <div className="mt-4 text-sm text-gray-400 text-center">
          还没有账号？<a href="/register" className="text-blue-500 underline">注册</a>
        </div>
      </form>
    </div>
  );
};
export default LoginPage;
