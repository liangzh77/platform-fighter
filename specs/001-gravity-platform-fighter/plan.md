# Implementation Plan: 重力平台对战游戏

**Branch**: `001-gravity-platform-fighter` | **Date**: 2025-10-12 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `specs/001-gravity-platform-fighter/spec.md`

## Summary

这是一个双人本地对战的平台跳跃格斗游戏。两名玩家在三个高低不同的平台(左上、中下、右上)上进行战斗,使用四种不同技能攻击对手。游戏包含完整的生命系统、复活机制、技能冷却管理和重力物理系统。

**技术路线**: 纯前端Web应用,使用HTML5 Canvas渲染,基于配置驱动的模块化架构,无后端依赖,支持本地双人游戏(共享键盘)。

## Technical Context

**Language/Version**: JavaScript ES6+ / TypeScript (可选,建议使用TypeScript提高代码健壮性)
**Primary Dependencies**:
- 渲染: HTML5 Canvas API (原生) 或 PixiJS/Phaser (游戏引擎)
- 物理: 自定义重力系统(简单的向下加速度 + 碰撞检测)
- 构建工具: Vite (推荐,快速热更新)
**Storage**:
- 配置文件: JSON格式存储游戏数据(角色属性、技能配置、平台布局)
- 本地存储(可选): localStorage用于保存设置(音量、按键绑定等)
**Testing**:
- Jest/Vitest (单元测试)
- Playwright/Cypress (集成测试,模拟双人输入)
**Target Platform**:
- 桌面浏览器: Chrome/Edge/Firefox (最新2个版本)
- 移动浏览器: iOS Safari (iOS 14+), Chrome Mobile (Android 8+) - 注:移动端需要虚拟按键
**Project Type**: Single (纯前端单项目结构)
**Performance Goals**:
- 帧率: 60 FPS (桌面), 30 FPS (移动端)
- 首屏加载: < 3秒
- 输入延迟: < 100ms (从按键到角色响应)
- 技能冷却精度: ±0.1秒
**Constraints**:
- 内存占用: < 200MB (桌面), < 100MB (移动端)
- 包体积: < 10MB (压缩后)
- 无网络依赖: 所有资源必须本地加载
- 兼容性: 不依赖实验性浏览器特性
**Scale/Scope**:
- 2个可选角色
- 4个技能/角色
- 3个固定平台
- 单一游戏场景
- 约5000-8000行代码(估计)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ I. 配置驱动设计 (Configuration-Driven Design)

**验证要点**:
- [ ] 角色属性(生命值、复活次数)是否从配置加载?
- [ ] 技能参数(伤害、冷却、范围)是否从JSON/YAML配置?
- [ ] 平台位置和尺寸是否可配置?
- [ ] 物理参数(重力加速度、跳跃力)是否可调整?

**预期配置文件**:
- `assets/config/characters.json` - 角色A和B的属性
- `assets/config/skills.json` - 所有技能的定义
- `assets/config/platforms.json` - 三个平台的坐标
- `assets/config/physics.json` - 重力、击退、摩擦力等参数

**合规性**: ✅ 设计完全符合 - 无硬编码游戏数据

---

### ✅ II. 模块化架构 (Modular Architecture)

**验证要点**:
- [ ] 输入系统(InputManager)独立于游戏逻辑?
- [ ] 渲染模块(Renderer)与游戏状态解耦?
- [ ] 技能系统(SkillSystem)可独立测试?
- [ ] 物理引擎(PhysicsEngine)封装良好?

**预期模块**:
```
src/systems/
├── InputManager.js      # 键盘输入处理
├── Renderer.js          # Canvas渲染抽象
├── PhysicsEngine.js     # 重力、碰撞检测
├── SkillSystem.js       # 技能释放、冷却管理
├── StateManager.js      # 游戏状态机(菜单/对战/结束)
├── AudioManager.js      # 音效播放(可选)
└── ConfigLoader.js      # 配置文件加载器

src/entities/
├── Character.js         # 角色实体
├── Skill.js             # 技能实体
└── Platform.js          # 平台实体
```

**合规性**: ✅ 设计符合模块化原则

---

### ✅ III. 数据与代码分离 (Data-Code Separation)

**验证要点**:
- [ ] 所有资源在独立的 `assets/` 目录?
- [ ] 资源路径通过AssetLoader加载,无硬编码路径?
- [ ] 开发/生产环境路径可配置?

**预期目录结构**:
```
project/
├── src/                 # 源代码
│   ├── core/            # 核心引擎(游戏循环、时间管理)
│   ├── systems/         # 游戏系统模块
│   ├── entities/        # 游戏对象类
│   ├── ui/              # UI组件(菜单、HUD)
│   └── utils/           # 工具函数
├── assets/              # 游戏资源
│   ├── config/          # 配置文件(JSON)
│   ├── images/          # 角色、平台、特效图片
│   ├── audio/           # 音效(可选)
│   └── fonts/           # 字体文件(可选)
├── tests/               # 测试文件
│   ├── unit/            # 单元测试
│   └── integration/     # 集成测试
├── public/              # 静态资源
│   └── index.html       # 游戏入口HTML
├── dist/                # 构建输出
├── package.json
├── vite.config.js       # Vite配置
└── README.md
```

**合规性**: ✅ 符合数据代码分离原则

---

### ✅ IV. 渐进式增强 (Progressive Enhancement)

**验证要点**:
- [ ] MVP定义清晰(最小可玩版本)?
- [ ] 功能优先级合理(P1核心 → P2增强 → P3完善)?
- [ ] 避免过度设计?

**实施顺序**:
1. **Phase 1 (P1)**: 核心玩法循环
   - 角色可以移动、跳跃、受重力影响
   - 简单的攻击(技能1)和生命值系统
   - 死亡和复活机制
2. **Phase 2 (P2)**: 技能系统
   - 四个技能完整实现
   - 冷却管理
   - 位置交换技能
3. **Phase 3 (P2)**: 平台系统完善
   - 三个平台的精确碰撞
   - 平台穿透逻辑
4. **Phase 4 (P3)**: UI和流程
   - 角色选择界面
   - 胜利画面
   - 再来一局功能
5. **Phase 5 (增强)**: 视觉和反馈
   - 技能特效
   - 击中反馈
   - 死亡动画

**合规性**: ✅ 符合渐进式开发原则

---

### ✅ V. 可调试性与可观测性 (Debugging & Observability)

**验证要点**:
- [ ] 提供开发者模式(Dev Mode)?
- [ ] 结构化日志(DEBUG, INFO, WARN, ERROR)?
- [ ] 性能监控(FPS、内存、渲染调用)?
- [ ] 错误包含上下文信息?

**调试工具要求**:
- **Debug UI**: 显示FPS、当前状态、角色坐标、技能冷却
- **日志系统**: 控制台输出(可过滤级别)
- **作弊命令** (开发模式):
  - `godMode()` - 无敌模式
  - `resetCooldowns()` - 重置所有技能冷却
  - `setHealth(player, value)` - 设置生命值
  - `teleport(player, x, y)` - 传送角色
- **可视化**:
  - 技能范围框(调试模式显示攻击判定区域)
  - 碰撞盒显示
  - 平台边界线

**合规性**: ✅ 包含完整调试工具计划

---

### 宪章合规总结

| 原则 | 状态 | 备注 |
|------|------|------|
| 配置驱动设计 | ✅ 合规 | 所有游戏数据通过JSON配置 |
| 模块化架构 | ✅ 合规 | 明确的系统模块划分 |
| 数据与代码分离 | ✅ 合规 | 资源独立于代码目录 |
| 渐进式增强 | ✅ 合规 | 按P1→P2→P3优先级实施 |
| 可调试性 | ✅ 合规 | 包含Debug UI和作弊命令 |

**Result**: ✅ **ALL CHECKS PASSED** - 可以进入Phase 0研究阶段

## Project Structure

### Documentation (this feature)

```
specs/001-gravity-platform-fighter/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── spec.md              # Feature specification (already created)
└── checklists/
    └── requirements.md  # Quality checklist (already created)
```

**Note**: 不生成 `contracts/` 目录,因为这是纯前端应用,无需API契约定义。

### Source Code (repository root)

```
游戏/
├── src/                 # 源代码
│   ├── core/            # 核心引擎
│   │   ├── Game.js          # 主游戏类(游戏循环)
│   │   ├── Time.js          # 时间管理(deltaTime)
│   │   └── AssetLoader.js   # 资源加载器
│   ├── systems/         # 游戏系统(模块)
│   │   ├── InputManager.js
│   │   ├── Renderer.js
│   │   ├── PhysicsEngine.js
│   │   ├── SkillSystem.js
│   │   ├── StateManager.js
│   │   └── ConfigLoader.js
│   ├── entities/        # 游戏对象
│   │   ├── Character.js
│   │   ├── Skill.js
│   │   └── Platform.js
│   ├── ui/              # UI组件
│   │   ├── MenuScene.js
│   │   ├── CharacterSelectScene.js
│   │   ├── BattleScene.js
│   │   ├── VictoryScene.js
│   │   └── HUD.js           # 抬头显示(生命值、技能冷却)
│   ├── utils/           # 工具函数
│   │   ├── Logger.js        # 日志系统
│   │   ├── Debug.js         # 调试工具
│   │   └── Math.js          # 数学辅助函数
│   └── main.js          # 入口文件
├── assets/              # 游戏资源
│   ├── config/          # 配置文件
│   │   ├── characters.json
│   │   ├── skills.json
│   │   ├── platforms.json
│   │   └── physics.json
│   ├── images/          # 图片资源
│   │   ├── characters/
│   │   ├── platforms/
│   │   └── effects/
│   └── audio/           # 音频资源(可选)
│       ├── sfx/
│       └── music/
├── tests/               # 测试文件
│   ├── unit/            # 单元测试
│   │   ├── Character.test.js
│   │   ├── SkillSystem.test.js
│   │   └── PhysicsEngine.test.js
│   └── integration/     # 集成测试
│       └── GameFlow.test.js
├── public/              # 静态文件
│   └── index.html       # 游戏入口
├── dist/                # 构建输出(Vite生成)
├── .specify/            # Speckit配置(已存在)
├── specs/               # 功能规格文档(已存在)
├── package.json         # NPM依赖
├── vite.config.js       # Vite构建配置
├── vitest.config.js     # Vitest测试配置
└── README.md            # 项目文档
```

**Structure Decision**:
选择 **单项目结构(Single Project)** ,因为:
- 纯前端应用,无需前后端分离
- 代码规模小(预计<8000行),无需拆分多个子项目
- 部署简单(静态资源托管)

## Complexity Tracking

*No violations detected - this table is empty.*

该项目完全遵循项目宪章的所有原则,无需记录复杂度豁免。
