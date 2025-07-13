# AI多语种SaaS平台前端

## 技术栈
    - React 18 / Next.js 14
    - TypeScript 5+
    - TailwindCSS 3+
    - axios

## 快速启动
### 本地开发:
    ```bash
    cd frontend
    npm install next-pwa
    npm install
    npm run dev
    访问 http://localhost:3000，手机扫码或浏览器访问
### 正式部署:
    npm run build
    npm run start
    建议配合 nginx 部署，支持 https
    手机端访问体验几乎等同原生App
### 核心体验:
    用户可在任意手机浏览器、微信、企业微信、钉钉等内置浏览器访问
    支持直接上传、任务查看、播放，适配触屏操作
    添加到主屏幕后，无浏览器地址栏、全屏沉浸体验，与App几乎一致
    支持暗色模式，视觉体验优良
### （可选）上线应用市场
    如后续要真正在App Store/应用宝上线，可用 uni-app/Cordova/Capacitor 封装，不需改动代码。
### 参考文档
    next-pwa官方文档<https://github.com/shadowwalker/next-pwa>
    Google PWA最佳实践<https://web.dev/progressive-web-apps/>
    Tailwind响应式设计<https://tailwindcss.com/docs/responsive-design>
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
## 启动前端开发环境
    npm run dev
    然后访问 http://localhost:3000

