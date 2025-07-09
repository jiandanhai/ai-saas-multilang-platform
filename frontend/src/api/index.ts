import axios from 'axios';

// 自动选择 API 地址，优先取 .env.local 配置
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE || '/api',
  timeout: 15000,
});

// 自动携带 token（如存在 localStorage.token，可根据你实际登录逻辑调整）
api.interceptors.request.use(config => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// 统一错误拦截（可按需增强提示）
api.interceptors.response.use(
  resp => resp,
  err => {
    // 可根据err.response.status做登录失效、弹窗等处理
    return Promise.reject(err);
  }
);

export default api;
