import React from "react";

const TrialQuotaBanner: React.FC<{ quotaLeft?: number }> = ({ quotaLeft }) => {
  if (typeof quotaLeft === "number" && quotaLeft <= 0) {
    return (
      <div className="fixed top-0 w-full bg-yellow-100 text-yellow-900 py-2 text-center font-bold shadow-md z-30 animate-pulse">
        免费试用额度已用完，请 <a href="/register" className="underline text-indigo-700">注册/登录</a> 解锁更多功能
      </div>
    );
  }
  return (
    <div className="fixed top-0 w-full bg-gradient-to-r from-indigo-200 via-blue-100 to-indigo-100 text-center py-2 text-xs shadow-sm z-20">
      <span>欢迎体验AI多语种SaaS平台，试用有额度限制，注册后可解锁全部能力</span>
    </div>
  );
};

export default TrialQuotaBanner;
