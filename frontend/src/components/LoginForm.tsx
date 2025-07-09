import React, { useRef, useState } from 'react';
import axios from 'axios';

const LoginForm: React.FC<{ onLogin: (token: string, username: string) => void }> = ({ onLogin }) => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError(""); setLoading(true);
    try {
      const form = new FormData();
      form.append('username', usernameRef.current?.value || '');
      form.append('password', passwordRef.current?.value || '');
      const resp = await axios.post('/api/login', form);
      if (resp.status === 200 && resp.data.access_token) {
        onLogin(resp.data.access_token, usernameRef.current?.value || '');
      } else {
        setError('无效响应');
      }
    } catch (e: any) {
      setError(e?.response?.data?.detail || '登录失败');
    } finally { setLoading(false); }
  };
  return (
    <div className="p-4 border rounded mb-4">
      <h2 className="font-bold mb-2">登录</h2>
      <input ref={usernameRef} placeholder="用户名" className="border p-1 mb-2 w-full" /><br/>
      <input ref={passwordRef} type="password" placeholder="密码" className="border p-1 mb-2 w-full" /><br/>
      <button className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading} onClick={handleLogin}>
        {loading ? '登录中...' : '登录'}
      </button>
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  );
};
export default LoginForm;
