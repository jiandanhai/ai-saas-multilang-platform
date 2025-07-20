// 2. TrialQuotaBanner.tsx 极致 UI 优化版
import React, { useState } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

interface TrialQuotaBannerProps {
  quotaLeft?: number;
}

const TrialQuotaBanner: React.FC<TrialQuotaBannerProps> = ({ quotaLeft }) => {
  const [showInfo, setShowInfo] = useState(false);

  let statusColor = "from-indigo-400 to-blue-400";
  let textColor = "text-indigo-900";
  let quotaTip = "";
  if (quotaLeft !== undefined && quotaLeft <= 3) {
    statusColor = "from-red-400 to-pink-400";
    textColor = "text-red-900 font-bold";
    quotaTip = "试用额度已接近上限，请尽快注册升级解锁更多功能";
  } else if (quotaLeft !== undefined && quotaLeft < 10) {
    statusColor = "from-yellow-300 to-orange-300";
    textColor = "text-yellow-900 font-bold";
    quotaTip = "试用额度即将用完，注册升级可享更多配额";
  } else {
    quotaTip = "当前为试用体验，额度有限";
  }

  return (
    <div className={`mt-16 mb-6 px-0 w-full flex justify-center`}>
      <div
        className={`
          bg-gradient-to-r ${statusColor} 
          rounded-xl shadow-lg px-5 py-2
          flex items-center gap-3
          transition-all duration-500
          relative
          animate-fadein
        `}
        onMouseEnter={() => setShowInfo(true)}
        onMouseLeave={() => setShowInfo(false)}
        style={{ minWidth: 330, maxWidth: 480 }}
      >
        <span className={`text-base font-semibold drop-shadow-sm ${textColor}`}>
          试用额度剩余
          <span className={`mx-2 px-2 py-0.5 rounded-lg bg-white/80 shadow-sm ${textColor}`}>
            {quotaLeft !== undefined ? quotaLeft : "--"}
          </span>
          次
        </span>
        <span className="relative">
          <InformationCircleIcon className="w-5 h-5 text-gray-600 cursor-pointer hover:text-indigo-600 transition" />
          {showInfo && (
            <span
              className="absolute left-1/2 -translate-x-1/2 mt-3 z-50 text-xs bg-white text-gray-700 shadow-lg rounded-xl px-4 py-2 border border-gray-200 whitespace-nowrap animate-popin"
              style={{ minWidth: 150 }}
            >
              {quotaTip}
              <div className="pt-2 text-[11px] text-gray-400">
                注册/升级套餐可解锁不限额度
              </div>
            </span>
          )}
        </span>
      </div>
    </div>
  );
};

export default TrialQuotaBanner;
