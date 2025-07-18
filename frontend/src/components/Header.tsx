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
    <header className="w-full py-3 px-6 flex justify-between items-center bg-white/70 shadow-md backdrop-blur-md sticky top-0 z-30 animate-fadein">
      {/* Logo+品牌名（你的 logo 路径需放在 public/icons/logo.png，或直接调整） */}
      <div className="flex items-center gap-2">
        <img src="/icons/logo.png" alt="Logo" className="h-9 w-9 rounded-xl shadow" />
        <span className="text-xl font-bold text-brand tracking-wider">AI多语种平台</span>
      </div>
      {/* 右上角操作 */}
      <nav className="flex items-center gap-4">
        {/* 个人中心/套餐 */}
        <Link href="/profile" className="hover:underline">个人中心</Link>
        <Link href="/plans" className="hover:underline">套餐升级</Link>
        {/* 登录/注册/用户名+退出 */}
        {token ? (
          <div className="flex items-center gap-3">
            <span className="text-brand">{username || "已登录用户"}</span>
            <button className="text-sm px-2 py-1 bg-gray-200 rounded hover:bg-gray-300" onClick={onLogout}>
              退出
            </button>
          </div>
        ) : (
          <>
            <Link href="/login" className="btn btn-link text-brand font-semibold">登录</Link>
            <Link href="/register" className="btn btn-brand bg-brand text-white px-4 py-2 rounded hover:bg-brand-dark">注册</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
