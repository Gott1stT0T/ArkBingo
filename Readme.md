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

## 🆕 黑流树海框架更新

### 框架更新
随便放了点东西进去

---

## 三个肉鸽

| 模式 | 词条数 | 状态 |
|------|--------|------|
| 萨卡兹肉鸽 | 101 | ✅ 已实装 |
| 界园肉鸽 | 126 | ✅ 已实装 |
| 黑流树海 | 约 100 | ⚠️ 框架预载 / AI 编撰 |

> 黑流树海模式的内容均为 AI 编撰，请勿当作官方设定或真实攻略。  

---

## 🎲 玩法规则

1. 选择一个集成战略：**萨卡兹 / 界园 / 黑流树海**。
2. 随机抽取 **25 个不重复词条**，生成 5×5 BINGO 网格。
3. 点击任意格子，即可标记为“已完成”。
4. 再次点击，取消标记。
5. 尽量让标记连成一条线——横、竖、斜，都算 BINGO！
6. 不满意？点击 **ReRoll**，或按 **Space / Enter** 直接刷新。
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

## 🧩 词条格式

可以投稿
词条遵循以下格式：

```js
"标题 描述内容"
```

例如：

```js
"我有自闭症！ 在场上至少存在6名干员，且所有干员周围8格不存在我方单位的情况下通过3关。"
```

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

或者下载右方最新release

---

## 🌐 在线部署

本项目已经适配 GitHub Pages。

---

## 🆘 注意事项

- 当前 `ReRoll` 按钮在代码层面没有硬性次数限制，规则文本写的是“可 ReRoll 3 次”。  
- 黑流树海模式为框架预载，词条均由 AI 编撰，请勿相信。
- 当前版本以“点击标记”为主，尚未加入 Bingo 连线判定与庆祝动画。  
  但，梦想还是要有的，万一哪天就连成线了呢？
- 游戏内标题使用了 `background-clip: text`，在部分老旧浏览器上可能显示为纯色，请使用现代浏览器。
- 本项目为非官方同人作品，与鹰角网络无关。

---

## 🗺️ 未来计划

- [ ] 增加 ReRoll 次数限制与显示
- [ ] 自动检测 BINGO 连线并播放雷霆庆祝动画
- [ ] 更多肉鸽主题
- [ ] 移动端体验进一步优化
- [ ] 让博士们连成更多线
- [ ] 增加“暗色 / 亮色”主题切换

---

## 🤝 贡献

欢迎所有博士来添砖加瓦！

1. Fork 本仓库。
2. 新建分支。
3. 添加新词条、新功能或修复问题。
4. 提交 Pull Request。

或者再issue内提交建议

词条格式请保持：

```js
"标题 描述"
```

请勿提交侵权素材、违规内容或冒充官方的设定。  

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

### ⚡ 神秘雷霆超级幻彩闪光超绝补充协议 v1.3

1. 明日方舟是鹰角的，罗德岛是博士的，Bingo 是大家的。
2. 你可以 Fork、Clone、魔改、二创，拿去和群友开黑。
3. 你可以把词条换成自己群里的黑话，但别拿去卖钱还说是官方。
4. 黑流树海暂时是 AI 编的，信了就会被雷劈。
5. 让背景安静，让文字闪耀。
6. 玩得开心，BINGO 拉满，别让博士在肉鸽里孤独。
7. 黑流树海太好玩了，所以让我们先想想词条写啥

---

## 鸣谢

感谢**嘲月**与**御坂16382**对词条库的编写

---

<div align="center">

**⚡ 让 BINGO 在罗德岛疯狂连成线！⚡**

<sub>By Dr. 嘲月, Gott1stT0T, 御坂16382</sub>

</div>
