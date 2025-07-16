// src/api/index.ts 终极修正版（兼容所有编辑器、严格 TS、PyCharm/VSCode 都不会报错）
import axios, { AxiosRequestConfig, AxiosInstance, InternalAxiosRequestConfig ,AxiosResponse } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE || '/api',
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 彻底TS安全写法：PyCharm/VSCode都100%不报错
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig<any>) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        // 创建全新对象，彻底避免 headers 类型问题
        const newHeaders: Record<string, string> = {};
        // 只处理原本 headers 为对象的情况
        if (config.headers && typeof config.headers === 'object' && !Array.isArray(config.headers)) {
          // 复制所有 string 类型的 header
          Object.entries(config.headers).forEach(([k, v]) => {
            if (typeof v === 'string') newHeaders[k] = v;
          });
        }
        // 覆盖 Authorization
        newHeaders['Authorization'] = `Bearer ${token}`;
        // 赋值（类型断言，TS 不会报错）
        (config as any).headers = newHeaders;
      }
    }
    return config;
  },
  error => Promise.reject(error)
);

// 响应拦截：401 自动跳转登录
api.interceptors.response.use(
  res => res,
  err => {
    if (err?.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        window.location.href = '/login';
      }
    }
    return Promise.reject(err);
  }
);

/** ====== 业务接口方法区 ====== */

// 注册（带邮箱/验证码）
export async function registerUser({ username, password, email, code }: { username: string, password: string, email: string, code?: string }) {
  return api.post('/register', { username, password, email, code });
}

// 发送邮箱验证码
export async function sendEmailCode(email: string) {
  return api.post('/send_code', { email });
}

// 登录（邮箱或用户名）
export async function loginUser(username: string, password: string): Promise<{ token: string }> {
  const res = await api.post("/login", { username, password });
  return res.data;  // 确保后端返回的是 {token: ...}
}

// 获取当前用户信息
export async function fetchUserInfo() {
  return api.get('/user/me');
}

// 获取任务列表（分页+状态筛选，健壮兼容格式）
export async function fetchTasks(params?: { page?: number; status?: string }) {
  try {
    const res: AxiosResponse = await api.get("/tasks", { params });
    // 多种数据结构兼容
    if (Array.isArray(res.data)) return res.data;
    if (res.data && Array.isArray(res.data.items)) return res.data.items;
    if (res.data && res.data.data && Array.isArray(res.data.data.items)) return res.data.data.items;
    if (res.data && res.data.data && Array.isArray(res.data.data)) return res.data.data;
    return [];
  } catch (err) {
    return [];
  }
}

// 获取单个任务详情
export async function fetchTaskDetail(taskId: string) {
  return api.get(`/tasks/${taskId}`);
}

// 上传文件
type UploadParams = { formData: FormData };
export async function uploadFile({ formData }: UploadParams) {
  return api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}

// 获取配额
export async function fetchTrialQuota() {
  return api.get('/quota');
}

export default api;
