# 1. 构建阶段
FROM node:18-alpine AS builder
WORKDIR /app

# 优化缓存：先复制依赖描述文件
COPY package.json package-lock.json ./

# 使用国内npm源，兼容旧lockfile
RUN npm config set registry https://registry.npmmirror.com \
    && npm install --legacy-peer-deps

# 复制源码
COPY . ./

# 构建 Next.js 生产包
RUN npm run build

# 2. 生产运行阶段（更安全、镜像小）
FROM node:18-alpine AS prod
WORKDIR /app

COPY --from=builder /app ./
ENV NODE_ENV=production
EXPOSE 3000

# 用 package.json 的 "start": "next start"
CMD ["npm", "run", "start"]
