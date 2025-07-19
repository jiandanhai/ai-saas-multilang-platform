import React from "react";
import Link from "next/link";

interface HeaderProps {
  token?: string;
  username?: string;
  onLogout?: () => void;
  quotaLeft?: number;
}

const Header: React.FC<HeaderProps> = ({ token, username, onLogout, quotaLeft }) => {
  return (
    <header className="w-full py-3 px-6 flex justify-between items-center bg-white/70 dark:bg-slate-900/70 shadow-md backdrop-blur-md sticky top-0 z-30 animate-fadein">
      {/* LOGO+品牌名（如无 logo.png 可用默认文字） */}
      <div className="flex items-center gap-2">
        <img src="/icons/logo.png" alt="Logo" className="h-9 w-9 rounded-xl shadow bg-gray-100 dark:bg-slate-800 object-cover" />
        <span className="text-xl font-bold text-brand tracking-wider drop-shadow">AI多语种平台</span>
      </div>
      {/* 右上角操作 */}
      <nav className="flex items-center gap-4">
        {/* 个人中心/套餐 */}
        <Link href="/profile" className="hover:underline text-gray-600 dark:text-gray-200 transition-colors">个人中心</Link>
        <Link href="/plans" className="hover:underline text-gray-600 dark:text-gray-200 transition-colors">套餐升级</Link>
        {/* 登录/注册/用户名+退出 */}
        {token ? (
          <div className="flex items-center gap-3">
            <span className="text-brand font-medium">{username || "已登录用户"}</span>
            <button
              className="text-sm px-3 py-1 bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-gray-100 rounded hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-700 transition-all"
              onClick={onLogout}
            >
              退出
            </button>
          </div>
        ) : (
          <>
            <Link
              href="/login"
              className="text-brand font-semibold px-3 py-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900 transition-all"
            >
              登录
            </Link>
            <Link
              href="/register"
              className="bg-brand hover:bg-brand-dark text-white font-semibold px-4 py-1.5 rounded shadow transition-all"
            >
              注册
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
