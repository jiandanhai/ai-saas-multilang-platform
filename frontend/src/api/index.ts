// src/api/index.ts 终极修正版（兼容所有编辑器、严格 TS、PyCharm/VSCode 都不会报错）
import axios, {AxiosInstance, AxiosRequestConfig, AxiosHeaders,AxiosResponse} from "axios";

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE || "/api",
  timeout: 15000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 拦截器写法，兼容 PyCharm/VSCode/TS，无类型红线
api.interceptors.request.use((config: any) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      let headers: Record<string, string> = {};
      // 保留原有 headers
      if (config.headers && typeof config.headers === "object") {
        if (typeof (config.headers as any).set === "function") {
          // Axios v1/v2 Headers 对象转普通对象
          headers = Object.fromEntries(
            Object.entries(config.headers as any).filter(
              ([k, v]) => typeof v === "string"
            )
          ) as Record<string, string>;
        } else {
          headers = { ...(config.headers as Record<string, string>) };
        }
      }
      headers["Authorization"] = `Bearer ${token}`;
      config.headers = headers as any;
    }
  }
  return config;
});

// 响应拦截：401时跳登录
api.interceptors.response.use(res => res, err => {
  if (err?.response?.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      window.location.href = "/login";
    }
  }
  return Promise.reject(err);
});

// 新增API
export async function sendVerifyCode(email: string): Promise<{success: boolean, message: string}> {
  const { data } = await api.post("/send-verify-code", { email });
  return data;
}

export async function registerUser(payload: {
  username: string;
  password: string;
  email: string;
  verify_code: string;
  agreed: boolean;
}) {
  const { data } = await api.post("/register", payload);
  return data;
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
