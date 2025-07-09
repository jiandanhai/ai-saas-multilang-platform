import React, { useRef, useState } from 'react';
import axios from 'axios';

const RegisterForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError(""); setLoading(true);
    try {
      const resp = await axios.post('/api/register', {
        username: usernameRef.current?.value,
        password: passwordRef.current?.value,
      });
      if (resp.status === 200) onSuccess();
    } catch (e: any) {
      setError(e?.response?.data?.detail || '注册失败');
    } finally { setLoading(false); }
  };
  return (
    <div className="p-4 border rounded mb-4">
      <h2 className="font-bold mb-2">注册</h2>
      <input ref={usernameRef} placeholder="用户名" className="border p-1 mb-2 w-full" /><br/>
      <input ref={passwordRef} type="password" placeholder="密码" className="border p-1 mb-2 w-full" /><br/>
      <button className="bg-green-600 text-white px-4 py-2 rounded" disabled={loading} onClick={handleRegister}>
        {loading ? '注册中...' : '注册'}
      </button>
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  );
};
export default RegisterForm;
