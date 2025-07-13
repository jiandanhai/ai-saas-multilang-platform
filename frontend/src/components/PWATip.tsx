import React, { useEffect, useState } from 'react';

const PWATip = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if ('standalone' in window.navigator && !window.matchMedia('(display-mode: standalone)').matches) {
      setTimeout(() => setShow(true), 2500);
    }
  }, []);
  if (!show) return null;
  return (
    <div className="fixed bottom-6 left-0 right-0 flex justify-center z-50">
      <div className="bg-blue-600 text-white px-4 py-2 rounded shadow-xl text-sm">
        建议点击浏览器菜单「添加到主屏幕」，体验更佳！
        <button className="ml-4 text-xs underline" onClick={() => setShow(false)}>关闭</button>
      </div>
    </div>
  );
};
export default PWATip;
