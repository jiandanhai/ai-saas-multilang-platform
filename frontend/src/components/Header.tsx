import React from "react";
import Link from "next/link";

interface HeaderProps {
  token?: string | null;
  username?: string | null;
  onLogout?: () => void;
  quotaLeft?: number | null;
}

const Header: React.FC<HeaderProps> = ({
  token,
  username,
  onLogout,
  quotaLeft,
}) => {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <img src="/icons/logo-512.png" alt="LinguaFlow" className="h-10" />
        <span className="font-bold text-lg tracking-wider text-brand">LinguaFlow 多语种AI平台</span>
      </div>
      <nav className="flex items-center gap-4">
        {typeof quotaLeft === "number" && (
          <span className="text-xs text-gray-500">
            剩余免费额度：<span className="font-bold text-brand">{quotaLeft}</span>
          </span>
        )}
        <Link href="/profile" className="hover:underline">个人中心</Link>
        <Link href="/plans" className="hover:underline">套餐升级</Link>
        {token ? (
          <>
            <span className="text-brand">{username}</span>
            <button
              className="text-xs text-gray-500 hover:text-brand px-2 py-1 border border-brand rounded"
              onClick={onLogout}
            >
              退出
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="hover:underline">登录</Link>
            <Link href="/register" className="hover:underline">注册</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
