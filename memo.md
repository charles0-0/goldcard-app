# GoldCard Pay 项目备忘录

## 项目概述

GoldCard Pay - 虚拟信用卡管理平台，支持用户注册登录、账户充值、虚拟卡申请、交易记录等功能。

## 技术栈

- **前端**: React + Vite + TailwindCSS
- **后端**: Python FastAPI (Vercel Serverless)
- **数据库**: Supabase (PostgreSQL)
- **部署平台**: Vercel

## 项目结构

```
goldcard-app/
├── api/                    # Vercel Serverless API
│   ├── index.py           # API 入口 (处理所有请求)
│   └── requirements.txt   # Python 依赖
├── frontend/              # React 前端
│   ├── src/              # 源代码
│   │   ├── pages/        # 页面组件
│   │   ├── layouts/     # 布局组件
│   │   └── i18n/        # 国际化
│   ├── dist/             # 构建产物
│   ├── package.json
│   └── vite.config.js
├── backend/              # 本地开发后端 (可选)
├── vercel.json           # Vercel 配置
└── README.md
```

## 关键配置

### Supabase 数据库

- **Project URL**: `https://aahqejldfvcyxqwixkcp.supabase.co`
- **Database Password**: `ma.em4C$*@H3UyK`

### Vercel 环境变量

在 Vercel Dashboard → Settings → Environment Variables 中配置：

```
SUPABASE_URL = https://aahqejldfvcyxqwixkcp.supabase.co
SUPABASE_PASSWORD = ma.em4C$*@H3UyK
JWT_SECRET = goldcard_secret_key_change_in_prod
ENV = production
```

### API 端点

- `/api/register` - 用户注册
- `/api/login` - 用户登录
- `/api/me` - 获取当前用户信息
- `/api/stats` - 获取统计数据
- `/api/cards` - 卡片管理
- `/api/transactions` - 交易记录
- `/api/account/topup` - 账户充值
- `/api/dashboard/chart` - 仪表盘图表数据

## 功能列表

- [x] 用户注册/登录 (支持邀请码)
- [x] 账户充值 (USDT/银行转账)
- [x] 虚拟卡申请
- [x] 实体卡申请
- [x] 交易记录查询
- [x] Dashboard 统计
- [x] 多语言支持 (中文/英文)
- [x] 移动端响应式适配

## 本地开发

```bash
# 前端开发
cd frontend
npm install
npm run dev

# 后端开发 (可选)
cd backend
pip install -r requirements.txt
ENV=development python -m uvicorn main:app --reload
```

## Vercel 部署

1. 连接 GitHub 仓库到 Vercel
2. 设置环境变量
3. 自动部署

## 注意事项

1. **数据库**: 使用 Supabase PostgreSQL，生产环境通过 `ENV=production` 切换
2. **密码特殊字符**: 数据库密码中的特殊字符 (`$*@`) 已通过 URL 编码处理
3. **CORS**: 后端已配置允许所有来源访问
4. **静态文件**: 前端构建产物在 `frontend/dist/`

## 相关文件

- `api/index.py` - Vercel Serverless 函数入口
- `frontend/vite.config.js` - Vite 配置
- `vercel.json` - Vercel 构建和路由配置

---

最后更新: 2026-02-28
