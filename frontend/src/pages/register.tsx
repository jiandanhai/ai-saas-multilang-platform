// src/pages/register.tsx

import React, { useState } from "react";
import Link from "next/link";
import api from "../api/index";
import { Dialog } from "@headlessui/react";
import { InformationCircleIcon, ShieldCheckIcon } from "@heroicons/react/24/outline";

interface RegisterForm {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  verifyCode: string;
  agree: boolean;
}

const Register: React.FC = () => {
  const [form, setForm] = useState<RegisterForm>({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    verifyCode: "",
    agree: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [codeLoading, setCodeLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [showTerms, setShowTerms] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [codeTimer, setCodeTimer] = useState(0);

  // 计时器逻辑
  React.useEffect(() => {
    let timer: any;
    if (codeTimer > 0) {
      timer = setTimeout(() => setCodeTimer(codeTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [codeTimer]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, agree: e.target.checked });
  };

  // 发送验证码
  const sendCode = async () => {
    if (!form.email) return setError("请填写邮箱后获取验证码");
    setError("");
    setCodeLoading(true);
    try {
      await api.post("/user/send-verify-code", { email: form.email });
      setCodeSent(true);
      setCodeTimer(60);
    } catch (e: any) {
      setError(e?.response?.data?.message || "验证码发送失败");
    } finally {
      setCodeLoading(false);
    }
  };

  // 注册提交
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!form.agree) return setError("请阅读并同意服务协议");
    if (!form.email || !form.username || !form.password || !form.verifyCode)
      return setError("请填写完整信息");
    if (form.password !== form.confirmPassword)
      return setError("两次密码不一致");
    setLoading(true);
    try {
      const res = await api.post("/user/register", {
        email: form.email,
        username: form.username,
        password: form.password,
        verify_code: form.verifyCode,
      });
      setSuccess("注册成功，请前往登录");
    } catch (e: any) {
      setError(e?.response?.data?.message || "注册失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-100 to-indigo-200 dark:from-zinc-800 dark:to-zinc-900 animate-fadein">
      <div className="w-full max-w-md bg-white/90 dark:bg-zinc-900/90 shadow-xl rounded-2xl p-8 backdrop-blur-lg animate-pop">
        <div className="flex flex-col items-center mb-6">
          <img src="/icons/logo-512.png" alt="LinguaFlow" className="h-14 mb-2" />
          <div className="font-extrabold text-2xl text-indigo-700 dark:text-indigo-200 mb-1">注册新账户</div>
          <div className="text-gray-400 text-sm mb-1">企业级 AI 多语种 SaaS</div>
        </div>

        <form onSubmit={handleRegister} autoComplete="off" className="space-y-4">
          <div>
            <input
              type="email"
              name="email"
              placeholder="邮箱 (可用于找回密码)"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              className="w-full rounded-lg px-4 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:outline-indigo-500"
              required
            />
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              name="username"
              placeholder="用户名"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
              className="flex-1 rounded-lg px-4 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:outline-indigo-500"
              required
            />
            <button
              type="button"
              disabled={codeLoading || codeTimer > 0}
              onClick={sendCode}
              className={`rounded-lg px-3 py-2 min-w-[90px] bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold shadow ${codeLoading || codeTimer > 0 ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {codeTimer > 0 ? `${codeTimer}s后重发` : (codeLoading ? "发送中..." : "获取验证码")}
            </button>
          </div>
          <div>
            <input
              type="text"
              name="verifyCode"
              placeholder="验证码"
              value={form.verifyCode}
              onChange={handleChange}
              className="w-full rounded-lg px-4 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:outline-indigo-500"
              required
            />
          </div>
          <div className="flex gap-2">
            <input
              type="password"
              name="password"
              placeholder="密码"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              className="flex-1 rounded-lg px-4 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:outline-indigo-500"
              required
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="确认密码"
              value={form.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              className="flex-1 rounded-lg px-4 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 focus:outline-indigo-500"
              required
            />
          </div>
          <div className="flex items-center">
            <input
              id="agree"
              name="agree"
              type="checkbox"
              checked={form.agree}
              onChange={handleCheck}
              className="mr-2 w-4 h-4 accent-indigo-600"
              required
            />
            <label htmlFor="agree" className="text-sm text-gray-500 dark:text-gray-400">
              我已阅读并同意
              <button
                type="button"
                className="text-indigo-600 hover:underline ml-1 text-xs"
                onClick={() => setShowTerms(true)}
              >
                《服务协议》
              </button>
            </label>
          </div>
          {/* 错误/成功提示 */}
          {error && (
            <div className="bg-red-100 border border-red-300 text-red-600 px-3 py-2 rounded-lg text-sm animate-shake">{error}</div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-300 text-green-700 px-3 py-2 rounded-lg text-sm animate-fadein">{success}</div>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-lg px-4 py-2 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg transition duration-200 ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            {loading ? "注册中..." : "注册"}
          </button>
        </form>

        {/* 其它操作/第三方登录扩展位 */}
        <div className="flex items-center justify-between mt-4">
          <Link href="/login" className="text-indigo-600 hover:underline text-sm">已有账号？登录</Link>
          {/* <div className="text-gray-400 text-xs">Google/微信/钉钉（可扩展）</div> */}
        </div>
      </div>

      {/* 服务协议弹窗 */}
      <Dialog open={showTerms} onClose={() => setShowTerms(false)} className="fixed z-50 inset-0 flex items-center justify-center">
        <Dialog.Overlay className="fixed inset-0 bg-black/40 animate-fadein" />
        <div className="relative bg-white dark:bg-zinc-900 rounded-2xl p-6 w-[90vw] max-w-xl shadow-2xl animate-pop">
          <h3 className="font-bold text-lg mb-3 flex items-center"><ShieldCheckIcon className="h-6 w-6 mr-2 text-indigo-500" />服务协议</h3>
          <div className="text-gray-600 dark:text-gray-300 text-sm max-h-[60vh] overflow-y-auto whitespace-pre-line">
            本服务遵循用户隐私保护原则，详见官网政策说明。如需企业版、API接入、定制开发，请联系客服。您须遵守相关法律法规与平台条款。平台对试用期间上传内容及处理结果享有合理的使用权。
          </div>
          <button
            className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 rounded-lg shadow"
            onClick={() => setShowTerms(false)}
          >我已阅读并同意</button>
        </div>
      </Dialog>
    </div>
  );
};

export default Register;
