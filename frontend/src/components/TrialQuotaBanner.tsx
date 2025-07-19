import React from "react";

const TrialQuotaBanner: React.FC<{ quotaLeft?: number }> = ({ quotaLeft }) => {
  if (quotaLeft == null) return null;
  return (
    <div className="w-full bg-blue-50 dark:bg-slate-800 border-b border-blue-200 dark:border-slate-700 text-blue-700 dark:text-blue-200 px-6 py-2 text-center font-semibold animate-fadein">
      {quotaLeft > 0
        ? <>试用额度剩余：<span className="font-bold text-xl">{quotaLeft}</span> 次，注册登录可享更多权益</>
        : <span className="text-red-600 dark:text-red-400 font-bold">试用额度已用尽，请注册/登录升级套餐</span>
      }
    </div>
  );
};
export default TrialQuotaBanner;
