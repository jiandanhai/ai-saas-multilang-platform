import React from "react";
import Link from "next/link";
import { SunIcon, MoonIcon, UserCircleIcon, ArrowLeftOnRectangleIcon  } from "@heroicons/react/24/outline";;

interface HeaderProps {
  token?: string;
  username?: string;
  onLogout?: () => void;
  quotaLeft?: number;
}

const Header: React.FC<HeaderProps> = ({ token, username, onLogout, quotaLeft }) => {
  // 主题切换留空钩子
  const [dark, setDark] = React.useState(false);

  React.useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) setDark(true);
  }, []);

  return (
    <header className={`sticky top-0 z-30 w-full bg-gradient-to-r from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 shadow-xl`}>
      <nav className="flex items-center justify-between max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center group">
            <img src="/icons/logo-512.png" alt="LinguaFlow" className="h-10 w-10 rounded-xl shadow transition-all group-hover:scale-110" />
            <span className="ml-3 text-2xl font-bold tracking-tight text-brand dark:text-white">LinguaFlow</span>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/profile" className="hidden sm:block px-3 py-1 hover:bg-brand/10 rounded transition text-gray-600 dark:text-gray-200">个人中心</Link>
          <Link href="/plans" className="hidden sm:block px-3 py-1 hover:bg-purple-200 dark:hover:bg-purple-800/40 rounded transition text-brand font-semibold">套餐升级</Link>
          {token && (
            <span className="flex items-center gap-2 ml-2">
              <UserCircleIcon className="w-6 h-6 text-indigo-500 dark:text-indigo-300" />
              <span className="font-medium">{username}</span>
            </span>
          )}
          {!token ? (
            <>
              <Link href="/login" className="ml-4 px-4 py-1.5 rounded-lg bg-brand text-white font-semibold shadow hover:scale-105 transition">登录</Link>
              <Link href="/register" className="ml-2 px-4 py-1.5 rounded-lg bg-indigo-100 dark:bg-indigo-900 text-brand dark:text-white font-semibold shadow hover:scale-105 transition">注册</Link>
            </>
          ) : (
            <button onClick={onLogout} className="ml-4 px-4 py-1.5 flex items-center gap-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100 hover:bg-red-200 dark:hover:bg-red-500/60 shadow transition font-semibold">
              <ArrowLeftOnRectangleIcon  className="w-5 h-5" />
              退出
            </button>
          )}
          {/* 主题切换（留空） */}
          <button onClick={() => setDark(d => !d)} className="ml-3 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition hidden sm:inline-flex" aria-label="切换主题">
            {dark ? <SunIcon className="w-6 h-6 text-yellow-400" /> : <MoonIcon className="w-6 h-6 text-indigo-400" />}
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;
