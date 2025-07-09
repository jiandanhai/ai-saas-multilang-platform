# AI多语种SaaS平台前端

## 技术栈
- React 18 / Next.js 14
- TypeScript 5+
- TailwindCSS 3+
- axios

## 快速启动
    ```bash
    npm install
    npm run dev

## 目录结构
    src/pages/ 入口页面（index.tsx, tasks.tsx, upload.tsx）
    src/components/ 业务组件（UploadFile, TaskList, TaskStatus 等）
    styles/ Tailwind 全局样式
## 配置说明
    默认API路径：/api/（代理到后端）
    支持Token登录，详见组件说明
## 常见命令
    npm run dev 本地开发（http://localhost:3000）
    npm run build 打包产物（.next/）
## 环境变量
    可在 .env.local 配置自定义 API 路径等：
    NEXT_PUBLIC_API_BASE=http://localhost:8000/api
    ---
### 2. frontend/api/index.ts
    ```ts
    // 封装 axios 实例，自动带 token，统一拦截
    import axios from 'axios';
    
    const api = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_BASE || '/api',
      timeout: 15000,
    });
    
    api.interceptors.request.use(config => {
      // 可选：自动携带本地token
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    });
    export default api;

# 注意
    pytharm没有用对项目根目录，用 PyCharm 打开的是整个后端+前端根目录，有时 TypeScript/JS 智能提示会失效。
    正确操作：
    切到 frontend 目录
    npm install
    npm install --save-dev @types/react @types/react-dom
    检查 tsconfig.json 设置和 node_modules 目录
    重启编辑器，重新索引
    用 WebStorm/VSCode 会更顺畅

