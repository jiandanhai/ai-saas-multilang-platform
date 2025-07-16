import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '../api';

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');
  const [agree, setAgree] = useState(false);

  // 验证码倒计时
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  // 发送验证码
  async function handleSendCode() {
    setErr('');
    if (!/^[\w.+-]+@[\w.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      setErr('请填写正确的邮箱');
      return;
    }
    try {
      await api.post('/send_email_code', { email });
      setCooldown(60);
    } catch (e: any) {
      setErr(e?.response?.data?.detail || '验证码发送失败');
    }
  }

  // 注册
  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    setOk('');
    if (!agree) {
      setErr('请阅读并同意服务协议');
      return;
    }
    try {
      await api.post('/register', { username, password, email, code });
      setOk('注册成功，请登录！');
      setTimeout(() => router.push('/login'), 1200);
    } catch (e: any) {
      setErr(e?.response?.data?.detail || '注册失败');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-fuchsia-100 via-white to-blue-200 animate-fadein">
      <form className="bg-white/90 dark:bg-slate-900/90 rounded-2xl shadow-2xl p-10 w-full max-w-md animate-slidein" onSubmit={handleRegister}>
        <h2 className="font-bold text-2xl mb-7 text-center bg-gradient-to-r from-fuchsia-600 to-blue-600 text-transparent bg-clip-text">注册账号</h2>
        <input
          className="block w-full mb-4 p-3 border rounded-xl bg-white/80 focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-200"
          placeholder="邮箱（推荐企业邮箱）"
          value={email}
          onChange={e => setEmail(e.target.value)}
          type="email"
          required
        />
        <div className="flex mb-4 gap-3">
          <input
            className="flex-1 p-3 border rounded-xl bg-white/80 focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-200"
            placeholder="邮箱验证码"
            value={code}
            onChange={e => setCode(e.target.value)}
            required
          />
          <button
            type="button"
            disabled={cooldown > 0}
            onClick={handleSendCode}
            className={`px-4 py-2 rounded-xl font-semibold text-white ${cooldown > 0 ? 'bg-gray-400':'bg-fuchsia-500 hover:bg-fuchsia-600'} transition-all`}
          >
            {cooldown > 0 ? `重新获取(${cooldown}s)` : '获取验证码'}
          </button>
        </div>
        <input
          className="block w-full mb-4 p-3 border rounded-xl bg-white/80 focus:border-fuchsia-400 focus:ring-2 focus:ring-fuchsia-200"
          placeholder="用户名（可选）"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          className="block w-full mb-6 p-3 border rounded-xl bg-white/80 focus:border-blue-400 focus:ring-2 focus:ring-blue-200"
          placeholder="密码（8位以上，数字+字母）"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          pattern="^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$"
          required
        />
        <label className="flex items-center gap-2 mb-4 text-sm select-none">
          <input type="checkbox" checked={agree} onChange={e=>setAgree(e.target.checked)} className="rounded accent-fuchsia-500" />
          我已阅读并同意 <a href="/terms" target="_blank" className="text-fuchsia-600 underline">服务协议</a>
        </label>
        <button type="submit"
          className="w-full py-3 bg-gradient-to-r from-fuchsia-500 to-blue-500 text-white rounded-xl hover:scale-105 transition-all font-bold text-lg">注册</button>
        {err && <div className="mt-3 text-red-500 text-center animate-shake">{err}</div>}
        {ok && <div className="mt-3 text-green-600 text-center animate-bounce">{ok}</div>}
        <div className="mt-5 text-sm text-gray-500 text-center">
          已有账号？<a href="/login" className="text-fuchsia-500 underline">登录</a>
        </div>
      </form>
    </div>
  );
};
export default RegisterPage;
