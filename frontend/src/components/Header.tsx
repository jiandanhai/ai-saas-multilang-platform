import React from "react";
import Link from "next/link";
import Image from "next/image";

const Header: React.FC<{ username?: string; onLogout?: () => void; quotaLeft?: number }> = ({ username, onLogout, quotaLeft }) => (
  <header className="flex items-center justify-between px-8 py-4 shadow bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg sticky top-0 z-40 animate-fadein">
      <div className="flex items-center gap-3">
        <Image src="/icons/logo-512.png" alt="Logo" width={40} height={40} />
        <Image src="/icons/logopng.png" alt="LinguaFlow" width={130} height={40} />
      </div>
    <Link href="/" className="font-black text-xl tracking-widest text-indigo-700 dark:text-white">AI多语种SaaS</Link>
    <nav className="flex gap-4 items-center">
      {quotaLeft !== undefined && (
        <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-200 text-xs mr-2">试用剩余 {quotaLeft}</span>
      )}
      {username ? (
        <>
          <span className="font-bold text-gray-700 dark:text-gray-200 mr-2">{username}</span>
          <Link href="/profile" className="hover:underline">个人中心</Link>
          <Link href="/plans" className="hover:underline">套餐升级</Link>
          <button onClick={onLogout} className="ml-4 px-4 py-1 rounded bg-indigo-600 text-white font-bold hover:bg-indigo-800 transition">退出</button>
        </>
      ) : (
        <>
          <Link href="/login" className="hover:underline font-bold text-indigo-600 dark:text-indigo-300">登录</Link>
          <Link href="/register" className="ml-2 hover:underline font-bold text-indigo-600 dark:text-indigo-300">注册</Link>
        </>
      )}
    </nav>
  </header>
);

export default Header;
