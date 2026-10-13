<div align="center">

<!-- ===== 动态变色标题 ===== -->
<a href="https://gott1stt0t.github.io/ArkBingo.github.io/">
  <img src="./assets/title.svg" alt="～博士的肉鸽BINGO～" width="700">
</a>

<br>

<!-- ===== 徽章墙 ===== -->
<p>
  <img src="https://img.shields.io/badge/HTML-单文件-1ACAED?style=for-the-badge&logo=html5&logoColor=white" alt="HTML">
  <img src="https://img.shields.io/badge/Tailwind-CDN-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind">
  <img src="https://img.shields.io/badge/JavaScript-原生-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript">
  <img src="https://img.shields.io/badge/动态炫彩-文字标题-FFE600?style=for-the-badge" alt="Dynamic Text">
  <img src="https://img.shields.io/badge/GitHub%20Pages-已部署-36D399?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Pages">
  <img src="https://img.shields.io/badge/License-MIT-EC4899?style=for-the-badge" alt="MIT">
</p>

> ⚠️ **警告**：黑流树海模式为框架预载，所属内容均为 AI 编撰，请勿相信！仅供娱乐！

</div>

---

## ⚡ 项目简介

这是一款基于《明日方舟》集成战略（肉鸽）玩法的同人 BINGO 小游戏合集。

默认 **N9 开局**，可 **ReRoll 3 次**，重开 **2 次**。  
目标只有一个：

> **让博士们尽量达成更多 BINGO！**

整个项目采用 **单文件 HTML** 构建，零构建、零后端、零安装，打开即玩。  
幻彩切换、雷霆刷新、神秘词条、点击标记——博士，你的肉鸽命运，就在这 5×5 的方寸之间！

---

## 🆕 最新更新：动态炫彩标题 × 加大 UI

### 🌈 动态炫彩标题

README 顶部标题 `～博士的肉鸽BINGO～` 会**自己动起来**：

- 🎞️ **打字机效果**：标题逐字打出、停留、清空、循环。
- 💡 **亮黄色调**：`FFE600` 亮黄，通透不刺眼。
- 🧊 **背景纯净**：标题区没有波浪、没有闪烁、没有面板动效，只有字在动。

### 🖥️ 游戏内动态炫彩标题

主标题 `～博士的肉鸽BINGO～` 在页面中：

- 🌈 **文字流动渐变**：霓虹青 → 荧光绿 → 亮黄 → 品红 → 亮紫，3.5 秒循环一圈。
- 💡 **文字发光**：三层 `drop-shadow` 只作用于文字本身。
- 🧊 **背景纯净**：容器是静态白色半透明卡片，没有扫描线、没有呼吸光晕、没有故障残影。

### 📏 入口 UI 全面加大

- 主容器从 `max-w-5xl` → `max-w-7xl`
- BINGO 网格从 `2xl` → `3xl`
- `ReRoll` 按钮升级为 `text-xl` + `py-5 px-10`
- 模式按钮与锁定按钮升级为 `text-lg` + `py-4 px-8`
- 格子内边距、圆角、字号全部上调
- 选中格子新增青绿光晕 `box-shadow`

---

## 🌈 三种模式，三重宇宙

| 模式 | 图标 | 主题色 | 词条数 | 状态 |
|------|------|--------|--------|------|
| 萨卡兹肉鸽 | 💀 | 萨卡兹红 | 101 | ✅ 已实装 |
| 界园肉鸽 | 🌿 | 界园粉 | 126 | ✅ 已实装 |
| 黑流树海 | ⭐ | 靛蓝 | 约 100 | ⚠️ 框架预载 / AI 编撰 |

> 黑流树海模式的内容均为 AI 编撰，请勿当作官方设定或真实攻略。  
> 如果你信了，雷霆会劈在博士头上。

---

## 🎲 玩法规则

1. 选择你喜欢的肉鸽模式：**萨卡兹 / 界园 / 黑流树海**。
2. 系统会从对应词条库中随机抽取 **25 个不重复词条**，生成 5×5 BINGO 网格。
3. 点击任意格子，即可标记为“已完成”。
4. 再次点击，取消标记。
5. 尽量让标记连成一条线——横、竖、斜，都算 BINGO！
6. 不满意？点击 **ReRoll**，或按 **Space / Enter** 雷霆刷新。
7. 怕误刷新？点击 **页面锁定**，把当前命运钉死在泰拉大地上。

---

## ⌨️ 快捷键

| 操作 | 功能 |
|------|------|
| `Space` | 未锁定时刷新 BINGO |
| `Enter` | 未锁定时刷新 BINGO |
| 鼠标点击格子 | 标记 / 取消完成状态 |
| 点击 `ReRoll` | 重新随机抽取 25 个词条 |
| 点击 `页面锁定` | 锁定 / 解锁页面，防止误刷新 |
| 点击模式按钮 | 切换萨卡兹 / 界园 / 黑流树海 |

---

## ✨ 功能亮点

- ⚡ **单文件 HTML**：所有结构、样式、逻辑都在 `index.html` 中，复制即用。
- 🌈 **三模式幻彩切换**：萨卡兹红、界园粉、黑流树海靛蓝，前缀颜色随模式变化。
- 🎲 **5×5 随机不重复词条**：从词条库中抽取 25 条，拒绝重复。
- 🖱️ **点击标记完成**：像真正的 BINGO 一样，点一下，命运就亮起。
- 🔒 **页面锁定**：防止手滑刷新，保护博士的肉鸽成果。
- ⌨️ **键盘快捷刷新**：Space / Enter 一键 ReRoll。
- 📱 **响应式布局**：手机、平板、电脑都能 Bingo。
- 🧠 **词条格式自动美化**：第一个空格前为粗体标题，后面为描述。
- 🚀 **GitHub Pages 直部署**：推上去，打开链接，开玩。
- 🌈 **动态炫彩文字标题**：文字流动渐变 + 发光，背景保持纯净不动。
- 🎞️ **README 动态打字机标题**：仓库首页标题逐字播放，背景透明。
- 📏 **加大版 UI**：更大网格、更大按钮、更大字号，触控与视觉双重升级。

---

## 🧩 词条格式

词条遵循以下格式：

```js
"标题 描述内容"
```

例如：

```js
"我有自闭症！ 在场上至少存在6名干员，且所有干员周围8格不存在我方单位的情况下通过3关。"
```

渲染时，第一个空格前的“标题”会变成对应模式的粗体彩色文字，后面的“描述内容”会显示在下方。

如果你想添加新词条，只要往对应数组里塞字符串即可：

- `sarkazWordBank`：萨卡兹肉鸽
- `gardenWordBank`：界园肉鸽
- `divineWordBank`：黑流树海 / 神人肉鸽预载

---

## 🛠️ 技术栈

| 技术 | 用途 |
|------|------|
| HTML5 | 页面结构 |
| Tailwind CSS CDN | 样式、响应式、自定义主题 |
| Font Awesome 4.7 | 图标 |
| 原生 JavaScript | 词条抽取、网格生成、模式切换、锁定、快捷键 |
| 原生 CSS Animation | 文字流动渐变、发光 |
| readme-typing-svg | README 动态打字机标题 |
| GitHub Pages | 在线部署 |

没有 npm，没有 webpack，没有 vite，没有复杂的依赖树。  
只有 HTML、CSS、JS，以及博士的肉鸽之魂。

---

## 🚀 本地运行

克隆仓库：

```bash
git clone https://github.com/Gott1stT0T/ArkBingo.github.io.git
cd ArkBingo.github.io
```

直接双击 `index.html` 即可。

或者起一个本地静态服务器：

```bash
python -m http.server 8080
```

然后访问：

```text
http://localhost:8080
```

---

## 📦 目录结构

```text
ArkBingo.github.io/
├── index.html      # 全部内容：结构、样式、脚本、词条库、动态炫彩标题
├── README.md       # 你正在看的这份动态炫彩 README
└── LICENSE         # 建议添加 MIT License
```

---

## 🌐 在线部署

本项目已经适配 GitHub Pages。

1. 推送代码到 `main` 分支。
2. 进入 GitHub 仓库的 **Settings → Pages**。
3. Source 选择 **Deploy from a branch**。
4. 分支选择 `main`，目录选择 `/ (root)`。
5. 保存后访问：

```text
https://gott1stt0t.github.io/ArkBingo.github.io/
```

---

## 🎨 README 动态标题自定义

想换标题颜色 / 字号，只需改这一个 `<img>` 的 URL 参数：

```text
https://readme-typing-svg.demolab.com
  ?font=Fira+Code
  &weight=900
  &size=52                       ← 字号
  &duration=2600                 ← 每字间隔(ms)
  &pause=900                     ← 打完停留(ms)
  &color=FFE600                  ← 换颜色（00FFFF 亮青 / FF44FF 亮品红 / 00FF9D 亮绿）
  &center=true
  &vCenter=true
  &multiline=true
  &width=1000
  &height=130
  &lines=～博士的肉鸽BINGO～      ← 要显示的文字
```

游戏内标题想换配色，编辑 `.cyber-title` 的 `background` 一行：

```css
background: linear-gradient(90deg,
    #00ffff, #00ff9d, #aaff00, #ffe600,
    #ff44ff, #7b5cff, #00ffff);
background-size: 500% 100%;
animation: cyberFlow 3.5s linear infinite;   /* 想更快就调小 3.5s */
```

---

## 🧪 已知事项

- 当前 `ReRoll` 按钮在代码层面没有硬性次数限制，规则文本写的是“可 ReRoll 3 次”。  
  如果你想严格限制次数，可以自行在 JS 中增加计数器。
- 黑流树海模式为框架预载，词条均由 AI 编撰，请勿相信。
- 当前版本以“点击标记”为主，尚未加入 Bingo 连线判定与庆祝动画。  
  但，梦想还是要有的，万一哪天就连成线了呢？
- 游戏内标题使用了 `background-clip: text`，在部分老旧浏览器上可能显示为纯色，请使用现代浏览器。
- README 动态标题依赖 readme-typing-svg 外部服务，若服务不可用，图片会加载失败。
- 本项目为非官方同人作品，与鹰角网络无关。

---

## 🗺️ 未来计划

- [ ] 增加 ReRoll 次数限制与显示
- [ ] 自动检测 BINGO 连线并播放雷霆庆祝动画
- [ ] 支持自定义词条 / 导入导出词条库
- [ ] 本地存储当前 BINGO 进度
- [ ] 增加更多肉鸽主题
- [ ] 人工审核并扩充黑流树海词条
- [ ] 移动端体验进一步优化
- [ ] 让博士们连成更多线
- [x] 游戏内动态炫彩文字标题（背景纯净）
- [x] 入口 UI 加大
- [x] README 动态打字机标题
- [ ] 加入音效 / BGM 开关
- [ ] 增加“暗色 / 亮色”主题切换

---

## 🤝 贡献

欢迎所有博士来添砖加瓦！

1. Fork 本仓库。
2. 新建分支。
3. 添加新词条、新功能或修复问题。
4. 提交 Pull Request。

词条格式请保持：

```js
"标题 描述"
```

请勿提交侵权素材、违规内容或冒充官方的设定。  
黑流树海相关内容请明确标注为 AI 编撰或同人娱乐。  
如果你想调整标题效果，建议保留“背景安静、文字流动”的设计原则。

---

## ⚠️ 免责声明

> 本项目为非官方同人作品，与鹰角网络无关。  
> 《明日方舟》及其相关名称、设定、角色版权归鹰角网络所有。  
> 黑流树海模式为框架预载，所有词条均由 AI 编撰，请勿相信。  
> 本项目仅供娱乐、交流与学习使用，禁止用于商业冒充官方。

---

## 📜 协议 / License

代码部分采用 **MIT License**。  
你可以自由使用、修改、分发、商用，只需保留版权声明。

### ⚡ 雷霆幻彩中二补充协议 v1.3

1. 明日方舟是鹰角的，罗德岛是博士的，Bingo 是大家的。
2. 你可以 Fork、Clone、魔改、二创，拿去和群友开黑。
3. 你可以把词条换成自己群里的黑话，但别拿去卖钱还说是官方。
4. 黑流树海是 AI 编的，信了就会被雷劈。
5. 让背景安静，让文字闪耀。
6. 玩得开心，BINGO 拉满，别让博士在肉鸽里孤独。

---

<div align="center">

**⚡ 让 BINGO 在罗德岛疯狂连成线！⚡**

<sub>Made with ❤️ by Dr. Gott1stT0T & 所有热爱肉鸽的博士</sub>

</div>
