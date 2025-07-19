import React from "react";

interface TrialQuotaBannerProps {
  quotaLeft?: number | null;
}

const TrialQuotaBanner: React.FC<TrialQuotaBannerProps> = ({ quotaLeft }) => {
  if (typeof quotaLeft !== "number") return null; // SSR阶段不渲染
  if (quotaLeft > 0) {
    return (
      <div className="w-full text-center py-2 bg-gradient-to-r from-indigo-50 to-blue-100 text-brand shadow">
        免费试用额度剩余 <span className="font-bold">{quotaLeft}</span> 次。注册/升级可解锁更多功能。
      </div>
    );
  }
  return (
    <div className="w-full text-center py-2 bg-red-50 text-red-600 shadow">
      免费额度已用完，请 <span className="font-bold">注册/登录</span> 升级套餐以继续使用！
    </div>
  );
};

export default TrialQuotaBanner;
