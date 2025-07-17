import React from "react";
import { useRouter } from "next/router";

export default function Header({
  token,
  username,
  onLogout,
}: {
  token?: string | null;
  username?: string | null;
  onLogout?: () => void;
}) {
  const router = useRouter();
  return (
    <header className="w-full flex items-center justify-between px-8 py-4 bg-frost/70 backdrop-blur-md shadow-glass rounded-b-2xl border-b border-gray-100 mb-8">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/")}>
        <img src="/logo192.png" alt="logo" className="h-9 w-9 rounded-full shadow" />
        <span className="text-xl font-extrabold text-brand tracking-wider drop-shadow-sm">LinguaFlow</span>
      </div>
      <nav className="flex items-center gap-6">
        <a href="/tasks" className="text-gray-700 hover:text-brand font-medium">任务列表</a>
        {!token ? (
          <>
            <button className="px-5 py-2 text-brand font-bold hover:underline" onClick={() => router.push("/login")}>
              登录
            </button>
            <button className="px-5 py-2 rounded-xl bg-brand text-white font-bold shadow hover:bg-brand-dark transition" onClick={() => router.push("/register")}>
              注册
            </button>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-gray-500">{username}</span>
            <button
              className="px-4 py-2 bg-brand text-white rounded-xl shadow hover:bg-brand-dark transition"
              onClick={onLogout}
            >
              退出登录
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}
