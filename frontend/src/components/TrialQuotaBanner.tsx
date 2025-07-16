import { useTrialQuota } from '../hooks/useTrialQuota';
import { useState, useEffect } from 'react';

export default function TrialQuotaBanner() {
  const { quota, limit, usedUp } = useTrialQuota();
  const [show, setShow] = useState(false);
  useEffect(() => { if (usedUp) setShow(true); }, [usedUp]);
  if (!usedUp) return <div className="fixed top-2 right-2 bg-yellow-100 px-4 py-2 rounded shadow">免费额度剩余 <b>{limit-quota}</b> 次</div>;
  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-200 text-center py-4 z-50">
      <h2>免费额度已用完</h2>
      <p>注册登录即可解锁更多用量！</p>
      <button className="btn btn-primary" onClick={()=>location.href='/register'}>去注册/登录</button>
    </div>
  );
}
