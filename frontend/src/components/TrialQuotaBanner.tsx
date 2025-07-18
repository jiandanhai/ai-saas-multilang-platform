import React from "react";

const TrialQuotaBanner: React.FC<{ quotaLeft?: number }> = ({ quotaLeft }) => {
  if (quotaLeft == null) return null;
  return (
    <div className="w-full bg-blue-100 border-b border-blue-300 text-blue-800 px-6 py-2 text-center font-medium animate-fadein">
      {quotaLeft > 0
        ? `试用额度剩余：${quotaLeft} 次，注册登录可享更多权益`
        : <span className="text-red-600">试用额度已用尽，请注册/登录升级套餐</span>
      }
    </div>
  );
};
export default TrialQuotaBanner;
