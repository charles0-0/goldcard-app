# GoldCard Pay - 虚拟信用卡管理平台

## 项目结构

```
goldcard-app/
├── api/                    # Vercel Serverless API
│   ├── index.py           # API 入口
│   └── requirements.txt   # Python 依赖
├── frontend/              # React 前端
│   ├── src/              # 源代码
│   ├── dist/             # 构建产物
│   └── package.json
├── backend/              # 本地开发后端 (可选)
├── .env                  # 环境变量
└── vercel.json           # Vercel 配置
```

## 快速开始

### 开发模式 (本地)

1. 安装前端依赖:
```bash
cd frontend
npm install
```

2. 启动前端:
```bash
npm run dev
```

3. 启动后端 (另一个终端):
```bash
cd ../backend
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

访问 http://localhost:5173

### 生产部署 (Vercel)

1. 安装 Vercel CLI:
```bash
npm i -g vercel
```

2. 登录 Vercel:
```bash
vercel login
```

3. 部署:
```bash
vercel
```

4. 设置环境变量 (在 Vercel Dashboard):
   - `SUPABASE_URL`: 你的 Supabase URL
   - `SUPABASE_PASSWORD`: 你的 Supabase 数据库密码
   - `JWT_SECRET`: JWT 密钥

## 功能

- [x] 用户注册/登录
- [x] 账户充值
- [x] 虚拟卡申请
- [x] 交易记录
- [x] 多语言支持 (中文/英文)
- [x] 移动端适配

## 技术栈

- **前端**: React + Vite + TailwindCSS
- **后端**: Python FastAPI (Vercel Serverless)
- **数据库**: Supabase (PostgreSQL)

## License

MIT
