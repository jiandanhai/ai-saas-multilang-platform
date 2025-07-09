#!/bin/bash
set -e

echo "====== Step 1: 构建前端 ======"
cd ../frontend
npm install
npm run build

echo "====== Step 2: 构建后端镜像 & 依赖安装 ======"
cd ../backend
python3.11 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

echo "====== Step 3: 初始化数据库（如需） ======"
python init_db.py

echo "====== Step 4: 启动docker-compose（全栈） ======"
cd ..
docker-compose up --build -d

echo "🎉 平台部署成功！"
echo "前端：http://localhost:3000"
echo "后端API：http://localhost:8000/docs"

# 如只需本地调试，可注释 docker-compose 那一行。
#deploy.sh 需要 chmod +x scripts/deploy.sh
#.env 环境变量请根据生产配置
#数据库连接失败请检查防火墙/端口/账户权限