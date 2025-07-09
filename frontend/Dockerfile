# 使用官方 Node.js 镜像
FROM node:16-alpine

# 设置工作目录
WORKDIR /app

# 复制依赖文件并安装依赖
COPY package.json package-lock.json /app/
RUN npm install

# 复制其他文件
COPY . /app/

# 暴露前端端口
EXPOSE 3000

# 启动命令
CMD ["npm", "run", "dev"]
