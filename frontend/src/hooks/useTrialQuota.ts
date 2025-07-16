import { useEffect, useState } from "react";
export function useTrialQuota() {
  const [quota, setQuota] = useState(0);
  const [limit, setLimit] = useState(10);
  useEffect(() => {
    fetch("/api/quota").then(res => res.json()).then(res => {
      setQuota(res.quota || 0); setLimit(res.limit || 10)
    })
  }, []);
  return { quota, limit, usedUp: quota >= limit };
}
