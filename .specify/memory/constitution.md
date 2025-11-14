<!--
=============================================================================
SYNC IMPACT REPORT
=============================================================================
Version Change: None → 1.0.0 (Initial Creation)

Modified Principles: N/A (Initial creation)

Added Sections:
- Core Principles (5 principles)
  1. Configuration-Driven Design
  2. Modular Architecture
  3. Data-Code Separation
  4. Progressive Enhancement
  5. Testing & Debugging
- Development Workflow
- Performance Standards
- Governance

Removed Sections: None

Templates Requiring Updates:
- ✅ plan-template.md - Constitution Check section confirmed compatible
- ✅ spec-template.md - Requirements structure aligns with principles
- ✅ tasks-template.md - Task organization supports modular architecture

Follow-up TODOs:
- None - all placeholders filled with concrete values

Rationale:
This is the initial constitution for a web game project. Version 1.0.0
establishes the foundational governance model emphasizing:
- Configuration over hard-coding
- Modularity for extensibility
- Clear separation of concerns
- Pragmatic simplicity (avoiding over-engineering)
=============================================================================
-->

# 网页游戏项目宪章

## 核心原则

### I. 配置驱动设计 (Configuration-Driven Design)

**规则:**
- 游戏数据(关卡配置、角色属性、平衡参数)必须与代码逻辑分离
- 使用JSON/YAML等结构化格式存储配置数据
- 配置文件必须可热加载,无需重新编译/刷新整个应用
- 禁止在代码中硬编码游戏内容数值(如伤害值、经验值、坐标等)

**为什么:**
- 策划/设计师可独立调整游戏平衡,无需程序员介入
- 快速迭代游戏内容和关卡设计
- 同一套代码可支持多个游戏变体
- 简化A/B测试和游戏调优

**示例:**
```javascript
// ❌ 错误 - 硬编码
class Enemy {
  constructor() {
    this.health = 100;
    this.damage = 15;
  }
}

// ✅ 正确 - 配置驱动
class Enemy {
  constructor(config) {
    this.health = config.health;
    this.damage = config.damage;
  }
}
// 配置从 enemies.json 加载
```

### II. 模块化架构 (Modular Architecture)

**规则:**
- 游戏系统必须按职责拆分为独立模块(渲染、输入、物理、音频、状态管理等)
- 每个模块必须有明确的接口(API),模块间通过接口通信
- 禁止模块间的紧耦合和循环依赖
- 新功能必须评估是否可作为独立模块添加

**为什么:**
- 单一模块的修改不影响其他系统
- 便于单元测试和调试
- 支持团队并行开发
- 模块可在不同项目间复用

**模块示例:**
- **InputManager** - 处理键盘/鼠标/触摸输入
- **Renderer** - 渲染引擎抽象层
- **AudioManager** - 音效和音乐管理
- **StateManager** - 游戏状态机(菜单、游戏中、暂停等)
- **EntitySystem** - 游戏对象管理(玩家、敌人、道具)
- **ConfigLoader** - 配置文件加载器

### III. 数据与代码分离 (Data-Code Separation)

**规则:**
- 所有游戏资源(图片、音频、配置)必须存放在独立的 `assets/` 目录
- 资源加载必须通过资源管理器(AssetLoader),不得直接硬编码路径
- 资源清单必须在启动时注册,支持预加载和懒加载策略
- 开发环境与生产环境的资源路径必须可配置

**目录结构要求:**
```
project/
├── src/               # 源代码
│   ├── core/          # 核心引擎
│   ├── systems/       # 游戏系统(模块)
│   ├── entities/      # 游戏对象类
│   └── utils/         # 工具函数
├── assets/            # 游戏资源
│   ├── config/        # 配置文件(JSON/YAML)
│   ├── images/        # 图片资源
│   ├── audio/         # 音频资源
│   └── data/          # 游戏数据(关卡、对话等)
├── tests/             # 测试文件
└── dist/              # 构建输出
```

**为什么:**
- 资源可独立更新,无需修改代码
- 便于资源版本管理和CDN部署
- 支持资源动态加载和内存优化
- 清晰的项目结构降低维护成本

### IV. 渐进式增强 (Progressive Enhancement)

**规则:**
- 必须先实现最小可玩版本(MVP),再添加高级特性
- 每个功能必须独立可测试,不依赖未完成的其他功能
- 避免过度设计 - 遵循YAGNI原则(You Aren't Gonna Need It)
- 重构时机:当相似代码出现3次以上时,才考虑抽象

**实施顺序:**
1. **核心玩法循环** - 玩家可以进行基本交互并看到结果
2. **基本反馈** - 简单的视觉/音频反馈
3. **基础UI** - 最小化界面(开始、暂停、重试)
4. **游戏循环** - 胜利/失败条件
5. **增强特性** - 动画、特效、音效、粒子系统等
6. **高级功能** - 存档、排行榜、社交分享等

**为什么:**
- 快速验证游戏玩法是否有趣
- 避免在无价值功能上浪费时间
- 降低技术债务和过度抽象风险
- 保持代码简洁和可维护性

### V. 可调试性与可观测性 (Debugging & Observability)

**规则:**
- 必须提供开发者调试模式(Dev Mode),可通过配置切换
- 关键系统必须输出结构化日志(使用日志级别:DEBUG, INFO, WARN, ERROR)
- 必须支持性能监控(FPS、内存使用、渲染调用次数)
- 错误必须包含上下文信息,不得静默失败

**调试工具要求:**
- **Debug UI** - 显示FPS、实体数量、当前状态
- **日志系统** - 可过滤的控制台输出
- **作弊命令** - 跳关、无敌、资源生成(仅开发模式)
- **状态可视化** - 碰撞盒、路径、触发区域的可视化

**为什么:**
- 显著减少调试时间
- 快速定位性能瓶颈
- 便于测试和迭代
- 提高开发效率和代码质量

## 开发工作流

### 分支策略
- `main` - 稳定版本,随时可发布
- `develop` - 开发分支,整合功能
- `feature/[name]` - 功能分支,从develop拉取
- `bugfix/[name]` - 修复分支

### 代码提交规范
- 遵循 Conventional Commits 格式
- 提交信息格式: `type(scope): description`
- 类型: `feat`, `fix`, `refactor`, `perf`, `test`, `docs`, `chore`

示例:
```
feat(combat): add combo attack system
fix(renderer): correct sprite clipping issue
refactor(config): migrate to YAML format
```

### 代码审查要求
- 所有功能必须经过代码审查
- 审查重点:
  - 是否遵循宪章原则
  - 是否有硬编码数据
  - 模块职责是否清晰
  - 性能影响评估

## 性能标准

### 必须满足的指标
- **帧率**: 60 FPS (桌面), 30 FPS (移动端)
- **首屏加载**: < 3秒(含核心资源)
- **内存占用**: < 200MB (桌面), < 100MB (移动端)
- **包体积**: < 10MB (压缩后,不含动态资源)

### 性能优化原则
- 优先使用对象池(Object Pool)避免频繁创建/销毁
- 图片资源必须使用精灵图(Sprite Sheet)
- 避免每帧进行大量DOM操作或Canvas绘制调用
- 使用requestAnimationFrame而非setInterval/setTimeout

## 技术约束

### 必须支持的平台
- **桌面浏览器**: Chrome/Edge (最新2个版本), Firefox (最新2个版本)
- **移动浏览器**: iOS Safari (iOS 14+), Chrome Mobile (Android 8+)

### 禁止的实践
- ❌ 在游戏循环(Game Loop)中使用同步I/O
- ❌ 全局变量污染(必须使用模块或命名空间)
- ❌ 未经测试的浏览器特性(必须检测或使用Polyfill)
- ❌ 内联样式和逻辑耦合
- ❌ 直接操作全局状态(必须通过StateManager)

### 推荐的技术栈
- **渲染**: HTML5 Canvas / WebGL (可选Phaser, PixiJS)
- **构建工具**: Vite / Webpack
- **语言**: JavaScript (ES6+) / TypeScript
- **配置格式**: JSON / YAML
- **测试**: Jest / Vitest

## 治理规则

### 宪章修正流程
1. 提出修正提案(包含理由和影响分析)
2. 团队讨论和审查(至少3个工作日)
3. 达成共识后更新宪章文档
4. 更新相关模板和工具链
5. 通知所有开发者并提供迁移指南(如需要)

### 版本管理
- 遵循语义化版本: MAJOR.MINOR.PATCH
- **MAJOR**: 删除或重新定义核心原则(破坏性变更)
- **MINOR**: 新增原则或显著扩展指导
- **PATCH**: 文字澄清、错误修正、格式调整

### 合规检查
- 每个Pull Request必须验证宪章合规性
- 代码审查必须检查:
  - 配置与代码是否分离
  - 模块间依赖是否合理
  - 是否存在硬编码数据
- 复杂度必须有合理理由 - 使用实施计划(plan.md)中的"Complexity Tracking"表记录

### 异议处理
- 如果宪章原则阻碍了合理需求,必须提出讨论
- 特殊情况可申请豁免,但必须:
  - 记录在案(Git提交消息或文档)
  - 说明技术理由
  - 评估技术债务
  - 制定后续改进计划

**Version**: 1.0.0 | **Ratified**: 2025-10-12 | **Last Amended**: 2025-10-12
