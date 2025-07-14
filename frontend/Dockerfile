# 使用官方Node 18 Alpine小体积镜像
FROM node:18-alpine AS builder

WORKDIR /app

# 优先复制 lockfile，加速缓存利用
COPY package.json package-lock.json ./

# 优化：用国内npm镜像源 & 兼容旧lockfile
RUN npm config set registry https://registry.npmmirror.com \
    && npm install --legacy-peer-deps

# 再复制源码
COPY . ./

# 构建前端生产包（适用于 Next.js/React/TypeScript 等）
RUN npm run build

# ---- 生产环境镜像 ----
FROM node:18-alpine AS prod
WORKDIR /app
COPY --from=builder /app .

EXPOSE 3000
# CMD ["npm", "run", "dev"]
CMD ["npm", "run", "start"]
