import React, { useState } from 'react';
import Link from 'next/link';
import { Dialog } from '@headlessui/react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import api from '../api/index';

const brand = {
  name: 'LinguaFlow',
  slogan: '多语言AI文档/音视频一站式转换平台',
  logo: '/icons/logo.png',
};

const INIT_STATE = {
  username: '',
  email: '',
  password: '',
  code: '',
  agree: false,
};

export default function RegisterPage() {
  const [form, setForm] = useState(INIT_STATE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [verifySent, setVerifySent] = useState(false);
  const [showAgreement, setShowAgreement] = useState(false);

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  async function handleSendCode() {
    if (!form.email) return setError('请输入有效邮箱');
    setLoading(true); setError('');
    try {
      await api.post('/user/send-verify-code', { email: form.email });
      setSuccess('验证码已发送，请查收邮箱'); setVerifySent(true);
    } catch (e: any) {
      setError(e.response?.data?.message || '发送验证码失败');
    } finally { setLoading(false); }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault(); setError(''); setSuccess('');
    if (!form.agree) return setError('请勾选同意平台协议');
    setLoading(true);
    try {
      const { data } = await api.post('/user/register', form);
      setSuccess('注册成功！请登录');
    } catch (e: any) {
      setError(e.response?.data?.message || '注册失败');
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-100 to-white flex items-center justify-center px-4">
      <div className="max-w-md w-full rounded-2xl bg-white/90 shadow-2xl p-10 relative animate-fadein">
        <div className="flex flex-col items-center mb-4">
          <img src={brand.logo} alt={brand.name} className="h-16 mb-2" />
          <h1 className="text-2xl font-bold text-brand mb-1">注册 {brand.name}</h1>
          <div className="text-xs text-gray-400 mb-3">{brand.slogan}</div>
        </div>
        <form onSubmit={handleRegister} className="space-y-5">
          <div>
            <input
              name="username"
              value={form.username}
              onChange={handleInput}
              placeholder="用户名"
              className="input w-full"
              autoComplete="username"
              required
              minLength={2}
              maxLength={30}
            />
          </div>
          <div>
            <input
              name="email"
              value={form.email}
              onChange={handleInput}
              placeholder="邮箱"
              type="email"
              className="input w-full"
              autoComplete="email"
              required
            />
          </div>
          <div className="flex gap-2">
            <input
              name="code"
              value={form.code}
              onChange={handleInput}
              placeholder="邮箱验证码"
              className="input flex-1"
              required
            />
            <button
              type="button"
              onClick={handleSendCode}
              disabled={loading || verifySent}
              className="btn-secondary px-3"
            >
              {verifySent ? '已发送' : '获取验证码'}
            </button>
          </div>
          <div>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleInput}
              placeholder="密码"
              className="input w-full"
              autoComplete="new-password"
              required
              minLength={6}
            />
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500 select-none">
            <input
              name="agree"
              type="checkbox"
              checked={form.agree}
              onChange={handleInput}
              id="agree"
              className="accent-brand"
            />
            <label htmlFor="agree">
              我已阅读并同意
              <button type="button" onClick={() => setShowAgreement(true)} className="text-brand underline ml-1">《用户协议与隐私政策》</button>
            </label>
          </div>
          <button
            type="submit"
            className="btn-primary w-full py-2 text-base font-semibold disabled:opacity-60"
            disabled={loading}
          >
            {loading ? '注册中...' : '注册'}
          </button>
        </form>
        <div className="mt-4 text-sm text-center text-gray-500">
          已有账号？<Link href="/login" className="ml-1 underline text-brand">登录</Link>
        </div>
        {(error || success) && (
          <div className={`mt-3 flex items-center gap-2 text-sm ${success ? 'text-green-600' : 'text-rose-500'}`}>
            {success ? <CheckCircleIcon className="w-5 h-5" /> : <XCircleIcon className="w-5 h-5" />}
            <span>{success || error}</span>
          </div>
        )}
        <Dialog open={showAgreement} onClose={() => setShowAgreement(false)} className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-2">
            <Dialog.Panel className="max-w-lg w-full bg-white p-8 rounded-xl shadow-lg relative">
              <Dialog.Title className="font-bold text-lg mb-2">用户协议与隐私政策</Dialog.Title>
              <div className="text-sm max-h-[40vh] overflow-y-auto text-gray-600">
                <p>欢迎注册并使用 {brand.name}，平台致力于保护您的个人隐私与数据安全，详见完整协议内容...</p>
                {/* 可补充丰富协议内容 */}
              </div>
              <button className="absolute top-3 right-3" onClick={() => setShowAgreement(false)}>
                <XCircleIcon className="w-6 h-6 text-gray-300 hover:text-gray-500" />
              </button>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </div>
  );
}

// 需要配套 tailwind.css 的 .input .btn-primary .btn-secondary .text-brand 主题色样式
// 建议添加国际化/i18n（此处为简体中文），如需支持英文请补充对应文案
