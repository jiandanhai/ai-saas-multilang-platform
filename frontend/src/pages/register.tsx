import React, { useState } from 'react';
import { useRouter } from 'next/router';
import api from '../api';

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    setOk('');
    try {
      await api.post('/register', { username, password });
      setOk('注册成功，请登录！');
      setTimeout(() => router.push('/login'), 1200);
    } catch (e: any) {
      setErr(e?.response?.data?.detail || '注册失败');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200">
      <form className="bg-white rounded-2xl shadow p-8 w-full max-w-sm" onSubmit={handleRegister}>
        <h2 className="font-bold text-xl mb-6 text-center">注册账号</h2>
        <input className="block w-full mb-3 p-2 border rounded" placeholder="用户名"
          value={username} onChange={e => setUsername(e.target.value)} />
        <input className="block w-full mb-5 p-2 border rounded" placeholder="密码" type="password"
          value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-bold">注册</button>
        {err && <div className="mt-2 text-red-500">{err}</div>}
        {ok && <div className="mt-2 text-green-600">{ok}</div>}
        <div className="mt-4 text-sm text-gray-400 text-center">
          已有账号？<a href="/login" className="text-blue-500 underline">登录</a>
        </div>
      </form>
    </div>
  );
};
export default RegisterPage;
