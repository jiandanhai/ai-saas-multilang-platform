import React from "react";
import Link from "next/link";

const Header: React.FC<{ username?: string; onLogout?: () => void; quotaLeft?: number }> = ({ username, onLogout, quotaLeft }) => (
  <header className="flex items-center justify-between px-8 py-4 shadow bg-white/80 backdrop-blur-lg sticky top-0 z-40 animate-fadein">
    <Link href="/" className="font-black text-xl tracking-widest text-indigo-700">AI多语种SaaS</Link>
    <nav className="flex gap-4 items-center">
      {quotaLeft !== undefined && (
        <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs mr-2">试用剩余 {quotaLeft}</span>
      )}
      {username ? (
        <>
          <span className="font-bold text-gray-700 mr-2">{username}</span>
          <Link href="/profile" className="hover:underline">个人中心</Link>
          <Link href="/plans" className="hover:underline">套餐升级</Link>
          <button onClick={onLogout} className="ml-4 px-4 py-1 rounded bg-indigo-600 text-white font-bold hover:bg-indigo-800 transition">退出</button>
        </>
      ) : (
        <>
          <Link href="/login" className="hover:underline font-bold text-indigo-600">登录</Link>
          <Link href="/register" className="ml-2 hover:underline font-bold text-indigo-600">注册</Link>
        </>
      )}
    </nav>
  </header>
);

export default Header;
