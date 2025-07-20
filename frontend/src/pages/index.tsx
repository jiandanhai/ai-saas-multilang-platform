import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import TrialQuotaBanner from '../components/TrialQuotaBanner';
import UploadFile from '../components/UploadFile';

const HomePage: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [quotaLeft, setQuotaLeft] = useState<number | null>(null);
  const [quotaError, setQuotaError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem('token');
    setToken(t);
    setUsername(localStorage.getItem('username'));
  }, []);

  useEffect(() => {
    async function fetchQuota() {
      setLoading(true);
      try {
        const res = await fetch('/api/user/quota', {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        });
        if (res.status === 402) {
          setQuotaLeft(0);
          setQuotaError('您的试用额度已用完，请注册或升级套餐。');
        } else if (res.ok) {
          const data = await res.json();
          setQuotaLeft(data.quotaLeft ?? 0);
          setQuotaError(null);
        } else {
          setQuotaLeft(0);
          setQuotaError('无法获取试用额度');
        }
      } catch (e) {
        setQuotaLeft(0);
        setQuotaError('网络错误，无法获取额度');
      } finally {
        setLoading(false);
      }
    }
    fetchQuota();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null);
    setUsername(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl">Loading...</div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-100 dark:from-zinc-950 dark:to-zinc-900">
      <Header token={token} username={username} onLogout={handleLogout} quotaLeft={quotaLeft ?? 0} />
      <TrialQuotaBanner quotaLeft={quotaLeft ?? 0} />
      <main className="max-w-3xl mx-auto px-4 py-12 flex flex-col items-center gap-8">
        {/* LOGO区 */}
        <div className="flex flex-col items-center w-full">
          <img
            src="/icons/logo.png"
            alt="LinguaFlow Logo"
            className="h-32 w-32 mb-3 drop-shadow-lg"
            style={{ maxWidth: 140, maxHeight: 140 }}
          />
          <h1 className="text-3xl md:text-4xl font-extrabold text-brand mb-1 text-center">LinguaFlow 多语言AI平台</h1>
        </div>
        {/* 配额提示 */}
        <div className="w-full flex flex-col items-center">
          <p className="mb-2 text-base text-gray-600 text-center">
            极速试用文件/语音转多语言。新用户赠送免费额度，额度用完后请注册/登录/升级套餐解锁全部功能。
          </p>
          {typeof quotaLeft === 'number' && (
            <p className="mb-2 text-blue-700 font-medium">
              剩余额度: <span className="font-bold">{quotaLeft}</span>
              {quotaLeft === 0 && <>
                ，<a href="/register" className="text-violet-700 underline ml-1">注册</a>
                或<a href="/plans" className="text-violet-700 underline ml-1">升级套餐</a>以继续使用！
              </>}
            </p>
          )}
          {quotaError && <p className="text-red-500 text-center mt-1">{quotaError}</p>}
        </div>
        {/* 上传文件区域 */}
        <section className="w-full flex flex-col items-center">
          <UploadFile
            token={token}
            quotaLeft={quotaLeft ?? 0}
            disabled={!!quotaError || (quotaLeft !== null && quotaLeft <= 0)}
          />
        </section>
      </main>
    </div>
  );
};

export default HomePage;
