# 赛博朋克交易终端

一个基于Next.js的现代化股票交易系统，集成实时数据、AI助手和语音交易功能。

## 技术栈

- **前端框架**: Next.js 16 (App Router)
- **语言**: TypeScript
- **状态管理**: Zustand
- **UI组件**: React, Tailwind CSS
- **3D图表**: Three.js
- **实时数据**: WebSocket连接
- **后端服务**: PocketBase
- **AI集成**: HuggingFace Transformers

## 系统功能

- 实时股票行情显示
- 3D K线图可视化
- 订单簿全息投影
- 语音交易指令
- AI投资助手
- 用户账户管理
- 交易订单管理
- 投资组合跟踪

## 本地开发

### 环境要求

- Node.js 18+
- PocketBase

### 安装依赖

```bash
npm install
```

### 启动PocketBase服务

```bash
cd ../pocketbase
./pocketbase serve
```

### 启动开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

## 部署

### Vercel部署

```bash
npm run build
npm run start
```

### 环境变量

需要配置以下环境变量：
- `NEXT_PUBLIC_POCKETBASE_URL`: PocketBase服务地址
- `ZHITU_API_TOKEN`: ZhituAPI访问令牌

## 项目结构

```
trading-frontend/
├── app/              # 页面路由
├── components/       # UI组件
├── lib/              # 工具库
├── hooks/            # 自定义Hooks
├── store/            # 状态管理
├── scripts/          # 脚本工具
└── public/           # 静态资源
```