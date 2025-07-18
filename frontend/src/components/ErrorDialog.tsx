import React from "react";

export default function ErrorDialog({
  open,
  onClose,
  message,
}: {
  open: boolean;
  onClose: () => void;
  message: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 animate-fadein">
      <div className="bg-white rounded-xl shadow-2xl px-8 py-6 min-w-[280px] flex flex-col items-center relative animate-pop">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-fuchsia-500 text-xl font-bold"
        >
          ×
        </button>
        <div className="text-red-600 text-xl font-bold mb-2">操作失败</div>
        <div className="mb-4 text-gray-700">{message}</div>
        <button
          className="px-6 py-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-lg font-bold shadow"
          onClick={onClose}
        >
          关闭
        </button>
      </div>
    </div>
  );
}
