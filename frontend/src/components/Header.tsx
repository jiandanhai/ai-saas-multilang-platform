import React from "react";
import Link from "next/link";

interface HeaderProps {
  username?: string;
  onLogout?: () => void;
  quotaLeft?: number;
}

const Header: React.FC<HeaderProps> = ({ username, onLogout, quotaLeft }) => (
  <header className="w-full flex justify-between items-center px-6 py-3 bg-white/80 dark:bg-gray-900/80 shadow-glass sticky top-0 z-30 animate-fadein">
    <div className="flex items-center gap-3">
      <Link href="/" className="flex items-center gap-2">
        <img
          src="/icons/logo-512.png"
          alt="Logo"
          className="h-10 w-10 rounded-xl shadow"
          style={{ objectFit: "contain", background: "#fff" }}
        />
        <span className="font-extrabold text-xl text-brand tracking-wide">LinguaFlow</span>
      </Link>
      {typeof quotaLeft === "number" && (
        <span className="ml-5 text-xs px-3 py-1 rounded-2xl bg-frost/50 text-brand font-semibold">
          剩余试用次数：{quotaLeft}
        </span>
      )}
    </div>
    <nav className="flex items-center gap-5">
      <Link href="/profile" className="hover:underline text-gray-700 dark:text-gray-200">个人中心</Link>
      <Link href="/plans" className="hover:underline text-gray-700 dark:text-gray-200">套餐升级</Link>
      {!username && (
        <>
          <Link href="/login" className="hover:underline text-brand">登录</Link>
          <Link href="/register" className="ml-1 hover:underline text-brand">注册</Link>
        </>
      )}
      {username && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">{username}</span>
          <button
            onClick={onLogout}
            className="px-3 py-1 rounded-xl bg-gray-100 hover:bg-frost text-brand text-xs"
          >
            退出
          </button>
        </div>
      )}
    </nav>
  </header>
);

export default Header;
