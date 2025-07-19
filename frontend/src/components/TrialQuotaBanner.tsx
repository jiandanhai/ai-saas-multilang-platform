import React from "react";

interface BannerProps {
  quotaLeft?: number;
}

const TrialQuotaBanner: React.FC<BannerProps> = ({ quotaLeft }) =>
  typeof quotaLeft === "number" ? (
    <div className="w-full flex justify-center py-2 bg-gradient-to-r from-blue-100/50 to-indigo-100/30 border-b border-indigo-50 shadow animate-fadein">
      <span className="text-sm text-brand-dark">
        当前剩余试用配额 <b>{quotaLeft}</b> 次，注册/升级后可无限畅用。
      </span>
    </div>
  ) : null;

export default TrialQuotaBanner;
