# 个人食谱小程序

一款简洁好用的微信小程序，用于记录和管理个人食谱。

## 功能

- **食谱列表** — 卡片式展示，支持按分类筛选
- **搜索** — 按菜名或食材关键词搜索
- **食谱详情** — 查看食材清单、烹饪步骤和小贴士
- **添加 / 编辑** — 动态添加食材和步骤
- **封面图片** — 支持从相册或拍照上传，本地持久保存
- **删除** — 支持删除不需要的食谱（同步清理图片文件）
- **本地存储** — 数据保存在手机本地，无需联网

首次打开会自动加载 2 道示例食谱（番茄炒蛋、皮蛋瘦肉粥），方便体验。

## 项目结构

```
recipe-miniapp/
├── app.js                 # 小程序入口
├── app.json               # 全局配置
├── app.wxss               # 全局样式
├── project.config.json    # 开发者工具项目配置
├── pages/
│   ├── index/             # 首页 - 食谱列表
│   ├── detail/            # 详情页
│   └── edit/              # 添加/编辑页
└── utils/
    ├── storage.js         # 本地存储与数据管理
    ├── image.js           # 图片选择与本地文件管理
    └── util.js            # 工具函数
```

## 快速开始

### 1. 安装微信开发者工具

下载并安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)。

### 2. 导入项目

1. 打开微信开发者工具
2. 选择「导入项目」
3. 目录选择本项目的 `recipe-miniapp` 文件夹
4. AppID 可选择「测试号」或使用自己的小程序 AppID（需修改 `project.config.json` 中的 `appid`）

### 3. 预览与调试

导入后即可在模拟器中预览。点击「预览」可用手机扫码真机体验。

## 自定义

- **分类**：在 `utils/storage.js` 中修改 `CATEGORIES` 数组
- **主题色**：在 `app.wxss` 和各页面 wxss 中调整 `#E85D04` 等颜色值
- **AppID**：在 `project.config.json` 中将 `touristappid` 替换为你的小程序 AppID

## 技术栈

- 微信小程序原生框架（WXML + WXSS + JavaScript）
- 本地存储 `wx.setStorageSync` / `wx.getStorageSync`

## 图片说明

封面图通过 `wx.chooseMedia` 选择后，保存到小程序本地用户目录（`wx.env.USER_DATA_PATH`），路径写入食谱的 `coverImage` 字段。删除食谱或更换封面时会自动清理旧图片文件。

## 后续可扩展

- 购物清单（根据食材一键生成）
- 云开发同步，多设备共享
