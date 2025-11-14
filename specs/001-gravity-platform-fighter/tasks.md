# Tasks: 重力平台对战游戏

**Input**: Design documents from `specs/001-gravity-platform-fighter/`
**Branch**: `001-gravity-platform-fighter`
**Date**: 2025-10-12

**Organization**: 任务按用户故事分组,每个故事可独立实现和测试。

## Format: `[ID] [P?] [Story] Description`
- **[P]**: 可并行执行(不同文件,无依赖)
- **[Story]**: 任务所属用户故事(US1, US2, US3, US4)
- 包含精确的文件路径

## Path Conventions
- **单项目结构**: `src/`, `assets/`, `tests/` 位于仓库根目录
- **纯前端项目**: 无backend/frontend分离

---

## Phase 1: Setup (项目初始化)

**目的**: 创建项目结构和安装基础依赖

- [x] T001 创建项目目录结构(src/, assets/, tests/, public/)
- [x] T002 初始化package.json并安装依赖(vite, vitest, eslint, prettier)
- [x] T003 [P] 配置vite.config.js和vitest.config.js
- [x] T004 [P] 配置eslint和prettier规则
- [x] T005 [P] 创建public/index.html入口文件
- [x] T006 [P] 创建README.md项目说明文档

---

## Phase 2: Foundational (核心基础设施)

**目的**: 构建所有用户故事依赖的核心引擎和系统框架

**⚠️ 关键**: 此阶段完成前,任何用户故事都无法开始实现

### 配置文件 (Configuration Files)

- [x] T007 [P] 创建assets/config/characters.json(角色A和B的配置)
- [x] T008 [P] 创建assets/config/skills.json(4个技能的配置)
- [x] T009 [P] 创建assets/config/platforms.json(3个平台的配置)
- [x] T010 [P] 创建assets/config/physics.json(重力、击退等参数)
- [x] T011 [P] 创建assets/config/input.json(玩家1和2的按键映射)
- [x] T012 [P] 创建assets/config/assets.json(资源清单)

### 工具类 (Utility Classes)

- [x] T013 [P] 实现src/utils/Math.js(Vector2, Rectangle, Circle类)
- [x] T014 [P] 实现src/utils/Logger.js(日志系统,支持DEBUG/INFO/WARN/ERROR)
- [x] T015 [P] 实现src/utils/Debug.js(调试工具,作弊命令)

### 核心引擎 (Core Engine)

- [x] T016 实现src/core/AssetLoader.js(资源预加载器,loadImage, loadAll方法)
- [x] T017 实现src/core/ConfigLoader.js(配置文件加载器)
- [x] T018 实现src/core/Time.js(时间管理,deltaTime计算)
- [x] T019 实现src/core/Game.js(主游戏类,游戏循环,requestAnimationFrame)

### 系统模块 (System Modules)

- [x] T020 [P] 实现src/systems/InputManager.js(键盘输入处理,维护按键状态表)
- [x] T021 [P] 实现src/systems/Renderer.js(Canvas渲染抽象层)
- [x] T022 [P] 实现src/systems/StateManager.js(游戏状态机,管理场景切换)
- [x] T023 实现src/systems/PhysicsEngine.js(重力系统,碰撞检测AABB和圆形)
- [x] T024 实现src/systems/SkillSystem.js(技能管理,冷却系统,弹道生成)

### 主入口 (Main Entry)

- [x] T025 实现src/main.js(游戏启动,资源加载,初始化Game实例)

**Checkpoint**: 核心引擎完成 - 用户故事实现可以开始

---

## Phase 3: User Story 1 - 基础对战循环 (Priority: P1) 🎯 MVP

**目标**: 两名玩家可以控制角色移动、跳跃、使用基本攻击(技能1),有生命值、死亡和复活机制,直到一方获胜。

**独立测试**: 两名玩家完成一场完整对战(从角色初始化到一方胜利),验证移动、基本攻击、生命系统和胜负判定。

### 实体类 (Entities)

- [x] T026 [P] [US1] 实现src/entities/Character.js(角色类,包含生命值、位置、速度、无敌状态)
- [x] T027 [P] [US1] 实现src/entities/Platform.js(平台类,包含位置、尺寸、碰撞检测)
- [x] T028 [US1] 实现Character的移动逻辑(左右移动,受摩擦力影响)
- [x] T029 [US1] 实现Character的跳跃逻辑(跳跃力,重力影响)
- [x] T030 [US1] 实现Character的死亡和复活逻辑(生命归零或掉出屏幕,在中间平台复活,3秒无敌)

### 基础技能 (Basic Skills)

- [x] T031 [P] [US1] 实现src/entities/Skill.js(技能基类,包含冷却管理)
- [x] T032 [US1] 实现技能1(近战攻击):大范围短距离扇形攻击,10点伤害,3秒冷却
- [x] T033 [US1] 实现伤害判定逻辑:检测技能范围内是否有敌方角色,应用伤害和击退

### 对战场景 (Battle Scene)

- [x] T034 [US1] 实现src/ui/BattleScene.js(对战场景,管理角色、平台、输入、物理更新)
- [x] T035 [US1] 实现BattleScene的update循环(处理输入,更新物理,检测碰撞,更新技能冷却)
- [x] T036 [US1] 实现BattleScene的render方法(绘制背景、平台、角色、生命条)
- [x] T037 [US1] 实现胜负判定逻辑(当某玩家用完复活次数后判定游戏结束)

### HUD界面 (Heads-Up Display)

- [x] T038 [P] [US1] 实现src/ui/HUD.js(显示双方生命值、复活次数、技能冷却)
- [x] T039 [US1] 在BattleScene中集成HUD显示

### 集成测试 (Integration)

- [x] T040 [US1] 集成Character、Platform、Skill到BattleScene
- [x] T041 [US1] 测试双人输入同时工作(玩家1 WASD+Q, 玩家2 方向键+U)
- [x] T042 [US1] 测试完整对战流程(移动、攻击、死亡、复活、胜利)

**Checkpoint**: 此时User Story 1应完全可玩 - 最小可玩版本(MVP)已完成!

---

## Phase 4: User Story 3 - 平台移动与重力系统 (Priority: P2)

**目标**: 完善三个平台的物理系统,支持角色在平台间跳跃,从下往上穿过平台,从上往下站立。

**独立测试**: 控制角色在三个平台(左上、中下、右上)间跳跃,验证重力、碰撞、平台穿透逻辑。

**注**: 此故事优先于US2,因为平台物理是技能系统的基础(技能需要准确的位置判定)。

### 平台系统增强 (Platform Enhancements)

- [ ] T043 [US3] 增强Platform.js:实现平台穿透逻辑(从下往上穿过,从上往下碰撞)
- [ ] T044 [US3] 在PhysicsEngine.js中实现精确的平台碰撞检测(检测角色底部与平台顶部)
- [ ] T045 [US3] 实现角色的isOnGround状态判定(用于跳跃和动画)
- [ ] T046 [US3] 调整重力参数和跳跃力度,确保角色能从中间平台跳到上层平台

### 边界检测 (Boundary Detection)

- [ ] T047 [US3] 实现屏幕边界死亡判定(左、右、下边界触碰即死亡)
- [ ] T048 [US3] 测试角色掉出屏幕底部后正确复活

### 空中控制 (Air Control)

- [ ] T049 [US3] 实现角色空中左右移动控制(允许在跳跃/坠落时改变方向)
- [ ] T050 [US3] 添加空中速度衰减(防止无限空中加速)

### 集成测试

- [ ] T051 [US3] 测试角色在三个平台间移动的流畅性
- [ ] T052 [US3] 测试从中间平台跳到左上/右上平台的成功率(目标>95%)
- [ ] T053 [US3] 测试技能1在不同平台高度的命中判定

**Checkpoint**: 平台物理系统完善,角色移动流畅自然

---

## Phase 5: User Story 2 - 技能战斗系统 (Priority: P2)

**目标**: 实现完整的4技能系统:技能1(近战,已在US1实现),技能2(远程弹道),技能3(位置交换),技能4(大招,A和B不同)。

**独立测试**: 使用所有4个技能,观察效果、冷却时间和视觉反馈,验证技能在各种场景下正常工作。

### 弹道系统 (Projectile System)

- [ ] T054 [P] [US2] 实现src/entities/Projectile.js(弹道类,包含位置、速度、伤害、生命周期)
- [ ] T055 [US2] 在SkillSystem.js中添加弹道生成逻辑(创建Projectile实例)
- [ ] T056 [US2] 实现弹道的update逻辑(移动、检测命中、超时销毁)
- [ ] T057 [US2] 实现弹道的render逻辑(绘制弹道精灵或简单形状)

### 技能2 - 远程弹道 (Ranged Projectile)

- [ ] T058 [US2] 实现技能2:小范围长距离弹道攻击,30点伤害,5秒冷却
- [ ] T059 [US2] 配置弹道速度(600像素/秒)和生命周期(2秒)
- [ ] T060 [US2] 测试弹道穿透逻辑(假设:弹道互相穿透,不相互抵消)

### 技能3 - 位置交换 (Position Swap)

- [ ] T061 [US2] 实现技能3:与对手瞬间交换位置,5秒冷却
- [ ] T062 [US2] 实现交换后的稳定时间(0.5秒,防止立即掉落)
- [ ] T063 [US2] 添加交换特效(swap_effect动画)

### 技能4 - 大招 (Ultimate Skills)

- [ ] T064 [P] [US2] 实现角色A的大招:小范围贯穿全屏80点伤害,20秒冷却
- [ ] T065 [P] [US2] 实现角色B的大招:中范围贯穿全屏40点伤害,15秒冷却
- [ ] T066 [US2] 配置大招弹道速度(1200像素/秒)和生命周期(3秒)

### 技能反馈 (Skill Feedback)

- [ ] T067 [P] [US2] 添加技能释放音效(skill_sound)
- [ ] T068 [P] [US2] 添加技能命中音效(hit_sound)
- [ ] T069 [US2] 实现技能命中时的视觉效果(闪光、震动、伤害数字)
- [ ] T070 [US2] 实现角色受击时的击退效果(0.3秒硬直,击退距离100像素)

### 冷却UI (Cooldown UI)

- [ ] T071 [US2] 在HUD.js中添加4个技能图标显示
- [ ] T072 [US2] 实现技能冷却倒计时显示(数字或遮罩)
- [ ] T073 [US2] 实现技能可用/冷却中的视觉区分(亮/暗)

### 无敌状态交互 (Invincibility Interaction)

- [ ] T074 [US2] 确保无敌状态下角色不受任何技能伤害
- [ ] T075 [US2] 测试复活无敌期间使用技能攻击对手(允许,战术的一部分)

### 集成测试

- [ ] T076 [US2] 测试所有4个技能的释放、命中、冷却
- [ ] T077 [US2] 测试技能组合(如技能2命中后立即技能3交换位置)
- [ ] T078 [US2] 测试技能冷却精度(误差应在±0.1秒内)
- [ ] T079 [US2] 测试空中释放技能(假设:所有技能可空中释放)

**Checkpoint**: 完整的4技能战斗系统,战术丰富

---

## Phase 6: User Story 4 - 角色选择与游戏流程 (Priority: P3)

**目标**: 完整的游戏流程:主菜单 → 角色选择 → 对战 → 胜利画面 → 重新开始。

**独立测试**: 从启动游戏到选择角色、完成对战、查看结果、重新开始的完整流程。

### 场景类 (Scene Classes)

- [ ] T080 [P] [US4] 实现src/ui/MenuScene.js(主菜单,显示"开始游戏"按钮)
- [ ] T081 [P] [US4] 实现src/ui/CharacterSelectScene.js(角色选择界面,玩家1和2分别选择A或B)
- [ ] T082 [P] [US4] 实现src/ui/VictoryScene.js(胜利画面,显示获胜玩家,提供"再来一局"和"返回主菜单"按钮)

### 状态管理 (State Management)

- [ ] T083 [US4] 在StateManager.js中注册4个场景(Menu, CharacterSelect, Battle, Victory)
- [ ] T084 [US4] 实现场景切换逻辑:Menu → CharacterSelect → Battle → Victory
- [ ] T085 [US4] 实现MatchState数据传递(玩家选择的角色 → BattleScene)

### UI交互 (UI Interactions)

- [ ] T086 [US4] 实现MenuScene的按钮点击处理(开始游戏 → 进入角色选择)
- [ ] T087 [US4] 实现CharacterSelectScene的角色选择UI(显示角色A和B的图标,玩家点击选择)
- [ ] T088 [US4] 实现CharacterSelectScene的"开始对战"按钮(双方选择完成后启用)
- [ ] T089 [US4] 实现VictoryScene的"再来一局"按钮(返回角色选择界面)
- [ ] T090 [US4] 实现VictoryScene的"返回主菜单"按钮(返回主菜单)

### 对战数据追踪 (Match Data Tracking)

- [ ] T091 [US4] 实现MatchState.js(记录玩家选择、对战时间、获胜者)
- [ ] T092 [US4] 在BattleScene中记录对战开始时间和持续时间
- [ ] T093 [US4] 在对战结束时将胜利者传递给VictoryScene

### 视觉完善 (Visual Polish)

- [ ] T094 [P] [US4] 添加主菜单背景图或样式
- [ ] T095 [P] [US4] 添加角色选择界面的角色预览图
- [ ] T096 [P] [US4] 添加胜利画面的庆祝动画或音效(victory_sound)

### 集成测试

- [ ] T097 [US4] 测试完整游戏流程(主菜单 → 角色选择 → 对战 → 胜利 → 再来一局)
- [ ] T098 [US4] 测试"返回主菜单"功能(确保状态正确重置)
- [ ] T099 [US4] 测试双方选择相同角色(如都选择A)是否正常工作

**Checkpoint**: 完整的游戏体验,从启动到结束的流畅流程

---

## Phase 7: Polish & Cross-Cutting Concerns (完善与优化)

**目的**: 跨故事的改进,优化性能、可调试性和用户体验

### 调试工具 (Debug Tools)

- [ ] T100 [P] 实现Debug.js中的调试UI(按F12显示FPS、实体数量、角色坐标)
- [ ] T101 [P] 实现作弊命令:godMode()(F1 - 无敌模式)
- [ ] T102 [P] 实现作弊命令:resetCooldowns()(F2 - 重置技能冷却)
- [ ] T103 [P] 实现碰撞盒可视化(F3 - 显示角色和技能的碰撞盒)
- [ ] T104 [P] 实现技能范围可视化(F4 - 显示技能攻击范围)

### 性能优化 (Performance Optimization)

- [ ] T105 实现对象池(Object Pool)避免频繁创建/销毁Projectile对象
- [ ] T106 优化渲染:仅绘制可见区域内的对象
- [ ] T107 测试桌面浏览器帧率(目标60FPS,工具:Chrome DevTools Performance)
- [ ] T108 测试首屏加载时间(目标<3秒)

### 动画系统 (Animation System)

- [ ] T109 [P] 实现角色动画系统(idle, run, jump, attack, death)
- [ ] T110 [P] 添加技能释放动画(0.2-0.5秒)
- [ ] T111 [P] 添加死亡和复活动画(目标<2秒)
- [ ] T112 实现角色朝向管理(根据移动方向翻转精灵)

### 视觉效果 (Visual Effects)

- [ ] T113 [P] 实现技能特效:melee_effect, projectile_effect, swap_effect
- [ ] T114 [P] 实现大招特效:ultimate_a_effect, ultimate_b_effect
- [ ] T115 [P] 实现复活无敌状态的闪烁效果(角色透明度变化)
- [ ] T116 实现击中时的屏幕震动效果(可选)

### 音频系统 (Audio System)

- [ ] T117 [P] 实现src/systems/AudioManager.js(音效播放,音量控制)
- [ ] T118 [P] 添加音效:hit_sound, jump_sound, skill_sound, death_sound, victory_sound
- [ ] T119 实现音效播放逻辑(在相应事件触发时播放)

### 资源文件 (Asset Files)

- [ ] T120 [P] 创建或寻找角色A和B的精灵图(character_a.png, character_b.png)
- [ ] T121 [P] 创建或寻找平台纹理(platform.png)
- [ ] T122 [P] 创建技能图标(skill_1.png, skill_2.png, skill_3.png, skill_4a.png, skill_4b.png)
- [ ] T123 [P] 创建特效图片(melee.png, projectile.png, swap.png, ultimate_a.png, ultimate_b.png)

### 配置微调 (Configuration Tuning)

- [ ] T124 调整重力参数(确保从上层平台落到下层约0.8-1秒)
- [ ] T125 调整击退参数(受击后击退约0.5个角色宽度)
- [ ] T126 调整技能范围和伤害平衡(通过配置文件多次迭代测试)

### 文档和测试 (Documentation & Testing)

- [ ] T127 [P] 编写单元测试:tests/unit/Character.test.js
- [ ] T128 [P] 编写单元测试:tests/unit/SkillSystem.test.js
- [ ] T129 [P] 编写单元测试:tests/unit/PhysicsEngine.test.js
- [ ] T130 [P] 编写集成测试:tests/integration/GameFlow.test.js
- [ ] T131 运行所有测试并修复失败项(npm run test)
- [ ] T132 生成测试覆盖率报告(npm run test:coverage,目标>70%)

### 兼容性测试 (Compatibility Testing)

- [ ] T133 测试Chrome浏览器(最新版本)
- [ ] T134 测试Firefox浏览器(最新版本)
- [ ] T135 测试Edge浏览器(可选)
- [ ] T136 测试不同键盘硬件的按键冲突问题

### 生产构建 (Production Build)

- [ ] T137 运行构建命令(npm run build)
- [ ] T138 测试生产构建(npm run preview)
- [ ] T139 验证包体积<10MB(压缩后)
- [ ] T140 验证调试功能在生产构建中已禁用

### 最终验证 (Final Validation)

- [ ] T141 按照quickstart.md中的测试清单完整验证
- [ ] T142 确认所有宪章原则合规(配置驱动、模块化、数据代码分离等)
- [ ] T143 代码格式化和Lint检查(npm run lint)
- [ ] T144 更新README.md添加游戏玩法说明和截图

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 无依赖 - 立即开始
- **Foundational (Phase 2)**: 依赖Setup完成 - **阻塞所有用户故事**
- **User Stories (Phase 3-6)**:
  - **US1 (Phase 3)**: 依赖Foundational完成 - MVP,最高优先级
  - **US3 (Phase 4)**: 依赖Foundational完成 - 建议在US2前完成(物理基础)
  - **US2 (Phase 5)**: 依赖Foundational和US3完成 - 技能系统依赖准确的物理判定
  - **US4 (Phase 6)**: 依赖US1完成 - 需要对战场景已存在
- **Polish (Phase 7)**: 依赖所有期望的用户故事完成

### User Story Dependencies

```
Foundational (Phase 2)
    ↓
US1: 基础对战循环 (Phase 3) - MVP ✅
    ↓
US3: 平台移动与重力 (Phase 4) - 物理基础 ⚡
    ↓
US2: 技能战斗系统 (Phase 5) - 完整战斗 🗡️
    ↓
US4: 角色选择与流程 (Phase 6) - 完整体验 🎮
    ↓
Polish & Optimization (Phase 7) - 优化完善 ✨
```

**注意**:
- US1可独立测试(最小可玩版本)
- US3增强US1的物理系统(平台跳跃)
- US2依赖US3的物理判定(技能命中检测)
- US4包装整个游戏流程(UI层)

### Within Each User Story

- 实体类 → 系统逻辑 → 场景集成 → 测试验证
- 标记[P]的任务可并行执行(不同文件)
- 同文件任务必须顺序执行

### Parallel Opportunities

#### Phase 2 (Foundational) - 最大并行度:
```bash
# 所有配置文件可同时创建 (T007-T012)
# 所有工具类可同时实现 (T013-T015)
# 系统模块可同时实现 (T020-T022)
```

#### Phase 3 (US1) - 实体并行:
```bash
# T026 Character.js + T027 Platform.js + T031 Skill.js (并行)
# T038 HUD.js (独立开发)
```

#### Phase 5 (US2) - 技能并行:
```bash
# T064 角色A大招 + T065 角色B大招 (并行)
# T067 音效 + T068 视觉效果 + T069 反馈 (并行)
```

#### Phase 7 (Polish) - 资源并行:
```bash
# T100-T104 所有调试工具 (并行)
# T109-T112 所有动画 (并行)
# T120-T123 所有资源文件 (并行)
# T127-T130 所有单元测试 (并行)
```

---

## Parallel Example: User Story 1 (基础对战循环)

```bash
# 第一批并行任务 - 实体类:
Task T026: "实现src/entities/Character.js"
Task T027: "实现src/entities/Platform.js"
Task T031: "实现src/entities/Skill.js"

# 等待上述完成后,第二批:
Task T028: "实现Character移动逻辑"
Task T029: "实现Character跳跃逻辑"
Task T030: "实现Character死亡复活逻辑"

# 独立并行任务:
Task T038: "实现src/ui/HUD.js"
```

---

## Implementation Strategy

### MVP First (仅User Story 1)

1. ✅ 完成Phase 1: Setup (T001-T006)
2. ✅ 完成Phase 2: Foundational (T007-T025) - **关键阻塞点**
3. ✅ 完成Phase 3: User Story 1 (T026-T042)
4. **停止并验证**: 测试双人对战,确保可玩
5. 如果满意,部署MVP或继续下一个故事

**MVP时间估算**: 约40-50小时(1-2周单人开发)

### Incremental Delivery (增量交付)

1. **MVP (US1)**: 基础对战可玩 → 验证核心玩法是否有趣 ✅
2. **MVP + 平台系统 (US1+US3)**: 三平台跳跃完善 → 验证空间战术 ⚡
3. **MVP + 完整战斗 (US1+US3+US2)**: 4技能系统 → 验证战斗深度 🗡️
4. **完整游戏 (US1+US3+US2+US4)**: 流程完整 → 可发布版本 🎮
5. **抛光版本 (All + Polish)**: 优化完善 → 最终版本 ✨

每个阶段都应独立测试并可演示。

### Parallel Team Strategy (多人并行)

如果有多个开发者:

1. **团队一起完成**: Setup + Foundational (Phase 1-2)
2. **Foundational完成后分工**:
   - 开发者A: User Story 1 (基础对战)
   - 开发者B: User Story 3 (平台系统)
   - 开发者C: 准备资源文件(Phase 7 T120-T123)
3. **US1+US3完成后**:
   - 开发者A: User Story 2 (技能系统)
   - 开发者B: User Story 4 (UI流程)
   - 开发者C: 调试工具和测试(Phase 7 T100-T104, T127-T130)
4. **最终合并**: 所有开发者一起完成Phase 7的优化和测试

---

## Notes

- **[P]**: 可并行任务,不同文件无依赖
- **[Story]**: 标记任务所属用户故事,便于追踪
- **配置驱动**: 所有游戏数值从JSON加载,禁止硬编码
- **测试策略**: 先验证核心玩法(US1),再逐步添加功能
- **提交频率**: 每完成1-3个任务提交一次,使用有意义的提交信息
- **Checkpoint**: 每个用户故事阶段结束后停下验证独立功能
- **性能目标**: 桌面60FPS,移动30FPS,首屏<3秒
- **包体积**: <10MB压缩后
- **测试覆盖**: 目标>70%

---

## Summary

- **总任务数**: 144个任务
- **按用户故事分布**:
  - Setup: 6个任务
  - Foundational: 19个任务
  - User Story 1 (P1): 17个任务 ← MVP
  - User Story 3 (P2): 11个任务
  - User Story 2 (P2): 26个任务
  - User Story 4 (P3): 20个任务
  - Polish: 45个任务
- **并行机会**: 约60个任务标记为[P],可显著加速开发
- **MVP范围**: Phase 1 + Phase 2 + Phase 3 (共42个任务)
- **建议实施顺序**: Setup → Foundational → US1 (验证) → US3 → US2 → US4 → Polish

**预估开发时间** (单人):
- MVP (US1): 1-2周
- MVP + US3: 2-3周
- MVP + US3 + US2: 3-4周
- 完整游戏 (All Stories): 5-6周
- 抛光版本 (All + Polish): 6-8周

**下一步**: 开始执行Task T001,创建项目目录结构!
