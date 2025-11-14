# Quickstart Guide: 重力平台对战游戏

**Feature**: 001-gravity-platform-fighter
**Date**: 2025-10-12
**Target Audience**: 开发者、测试人员

---

## Prerequisites (前置要求)

### 必需软件
- **Node.js**: v18+ (推荐使用 LTS 版本)
- **npm** 或 **pnpm** (包管理器)
- **Git**: 用于版本控制
- **现代浏览器**: Chrome 90+, Firefox 88+, Edge 90+

### 推荐工具
- **VS Code** + 以下扩展:
  - ESLint
  - Prettier
  - Live Server (可选,Vite已提供开发服务器)
- **浏览器开发者工具**: Chrome DevTools 或 Firefox Developer Tools

---

## Installation (安装)

### 1. 克隆仓库并切换分支

```bash
# 切换到功能分支
git checkout 001-gravity-platform-fighter

# 进入项目目录
cd 游戏
```

### 2. 安装依赖

```bash
# 使用 npm
npm install

# 或使用 pnpm (推荐,速度更快)
pnpm install
```

### 3. 验证安装

```bash
# 查看已安装的包
npm list --depth=0
```

**预期依赖**:
```
vite@^5.0.0         # 构建工具
vitest@^1.0.0       # 测试框架
eslint@^8.0.0       # 代码检查
prettier@^3.0.0     # 代码格式化
```

---

## Project Structure (项目结构)

```
游戏/
├── src/                     # 源代码
│   ├── core/                # 核心引擎
│   │   ├── Game.js          # 主游戏类
│   │   ├── Time.js          # 时间管理
│   │   └── AssetLoader.js   # 资源加载器
│   ├── systems/             # 游戏系统
│   │   ├── InputManager.js
│   │   ├── Renderer.js
│   │   ├── PhysicsEngine.js
│   │   ├── SkillSystem.js
│   │   ├── StateManager.js
│   │   └── ConfigLoader.js
│   ├── entities/            # 游戏对象
│   │   ├── Character.js
│   │   ├── Skill.js
│   │   └── Platform.js
│   ├── ui/                  # UI组件
│   │   ├── MenuScene.js
│   │   ├── CharacterSelectScene.js
│   │   ├── BattleScene.js
│   │   └── HUD.js
│   ├── utils/               # 工具函数
│   │   ├── Logger.js
│   │   ├── Debug.js
│   │   └── Math.js
│   └── main.js              # 入口文件
├── assets/                  # 游戏资源
│   ├── config/              # 配置文件(JSON)
│   ├── images/              # 图片资源
│   └── audio/               # 音频资源
├── tests/                   # 测试文件
├── public/                  # 静态文件
│   └── index.html
├── specs/                   # 功能规格文档
│   └── 001-gravity-platform-fighter/
│       ├── spec.md
│       ├── plan.md
│       ├── research.md
│       ├── data-model.md
│       └── quickstart.md    # 本文档
├── package.json
├── vite.config.js
└── README.md
```

---

## Development Workflow (开发流程)

### 启动开发服务器

```bash
# 启动 Vite 开发服务器(带热更新)
npm run dev

# 或使用 pnpm
pnpm dev
```

**预期输出**:
```
VITE v5.0.0  ready in 234 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h to show help
```

访问 `http://localhost:5173` 即可看到游戏界面。

---

### 开发模式快捷键

在浏览器中打开游戏后,可使用以下快捷键:

| 快捷键 | 功能 |
|--------|------|
| **F12** | 切换调试UI(显示FPS、实体数量、坐标) |
| **F1** | 上帝模式(玩家无敌) |
| **F2** | 重置所有技能冷却 |
| **F3** | 显示碰撞盒(红色框) |
| **F4** | 显示技能范围可视化 |
| **F5** | 刷新页面(标准浏览器功能) |

**注**: 生产构建不包含调试功能。

---

### 修改配置文件

所有游戏数值都在 `assets/config/` 目录下:

```bash
# 修改角色属性(生命值、移动速度)
vi assets/config/characters.json

# 修改技能参数(伤害、冷却、范围)
vi assets/config/skills.json

# 修改平台位置
vi assets/config/platforms.json

# 修改物理参数(重力、击退)
vi assets/config/physics.json

# 修改按键绑定
vi assets/config/input.json
```

**Vite热更新**: 保存配置文件后,浏览器会自动刷新并应用新配置(无需手动刷新)。

---

### 运行测试

```bash
# 运行所有单元测试
npm run test

# 运行测试并监听文件变化(推荐开发时使用)
npm run test:watch

# 生成测试覆盖率报告
npm run test:coverage
```

**测试示例**:
```javascript
// tests/unit/Character.test.js
import { describe, it, expect } from 'vitest';
import { Character } from '../../src/entities/Character.js';

describe('Character', () => {
  it('should take damage correctly', () => {
    const character = new Character({ maxHealth: 100 });
    character.takeDamage(30);
    expect(character.health).toBe(70);
  });

  it('should not take damage when invincible', () => {
    const character = new Character({ maxHealth: 100 });
    character.isInvincible = true;
    character.takeDamage(30);
    expect(character.health).toBe(100);
  });
});
```

---

### 构建生产版本

```bash
# 构建优化后的生产版本
npm run build

# 预览生产构建(本地测试)
npm run preview
```

**输出目录**: `dist/`

```
dist/
├── index.html
├── assets/
│   ├── main-[hash].js      # 压缩后的JavaScript
│   ├── main-[hash].css     # 样式文件(如有)
│   └── [images/audio...]   # 复制的资源文件
└── config/                  # 配置文件(JSON)
```

---

## Code Style Guide (代码规范)

### 命名约定

```javascript
// 类名: PascalCase
class CharacterController { }

// 函数/变量: camelCase
function updatePlayerPosition() { }
const playerHealth = 100;

// 常量: UPPER_SNAKE_CASE
const MAX_RESPAWNS = 3;
const GRAVITY_ACCELERATION = 980;

// 私有成员: 前缀下划线(约定,非强制)
class Renderer {
  _canvas = null;
  _context = null;
}
```

### 代码组织

```javascript
// ✅ 推荐: 清晰的模块导入
import { Vector2 } from './utils/Math.js';
import { Logger } from './utils/Logger.js';

export class Character {
  constructor(config) {
    // 1. 初始化属性(从配置加载)
    this.health = config.maxHealth;
    this.respawns = config.maxRespawns;

    // 2. 初始化依赖
    this.logger = new Logger('Character');

    // 3. 设置初始状态
    this.position = new Vector2(0, 0);
  }

  // 公共方法在前
  update(deltaTime) { }
  render(ctx) { }

  // 私有方法在后
  _checkCollision() { }
  _applyPhysics() { }
}
```

### 配置驱动原则

```javascript
// ❌ 错误: 硬编码数值
class Skill {
  constructor() {
    this.damage = 30;      // 禁止!
    this.cooldown = 5.0;   // 禁止!
  }
}

// ✅ 正确: 从配置加载
class Skill {
  constructor(config) {
    this.damage = config.damage;        // 从 skills.json 加载
    this.cooldown = config.cooldown;    // 从 skills.json 加载
  }
}
```

---

## Debugging Tips (调试技巧)

### 1. 查看游戏状态

在浏览器控制台输入:

```javascript
// 获取游戏实例(开发模式下暴露为全局变量)
window.game

// 查看玩家1的状态
window.game.player1.health
window.game.player1.position

// 查看当前场景
window.game.stateManager.currentState

// 手动触发技能(调试用)
window.game.player1.useSkill(0);  // 使用技能1
```

### 2. 性能分析

```javascript
// 打开调试UI(按F12或手动)
window.game.debug.show();

// 查看FPS
window.game.performanceMonitor.getFPS();

// 查看实体数量
window.game.entities.length;
```

### 3. 常见问题排查

| 问题 | 可能原因 | 解决方法 |
|------|----------|----------|
| 角色不动 | 输入配置错误 | 检查 `input.json` 按键绑定 |
| 技能无效果 | 技能范围/伤害配置错误 | 检查 `skills.json`,按F4显示范围 |
| 帧率低 | 渲染调用过多 | 按F12查看FPS,检查是否有不必要的绘制 |
| 碰撞异常 | 碰撞盒位置错误 | 按F3显示碰撞盒,检查 `characters.json` 的hitbox配置 |
| 配置未生效 | 缓存问题 | 硬刷新(Ctrl+Shift+R)或清除浏览器缓存 |

---

## Configuration Reference (配置速查)

### 角色配置 (`assets/config/characters.json`)

```json
{
  "characterA": {
    "maxHealth": 100,           // 最大生命值
    "maxRespawns": 3,           // 复活次数
    "invincibleDuration": 3.0,  // 复活无敌时间(秒)
    "moveSpeed": 200,           // 移动速度(像素/秒)
    "jumpForce": 500,           // 跳跃力度
    "hitbox": {
      "width": 40,
      "height": 60,
      "offsetX": -20,           // 相对角色中心的偏移
      "offsetY": -60
    }
  }
}
```

### 技能配置 (`assets/config/skills.json`)

```json
{
  "melee": {
    "damage": 10,               // 伤害值
    "range": 100,               // 攻击范围(像素)
    "angle": 3.14159,           // 攻击角度(弧度)
    "cooldown": 3.0,            // 冷却时间(秒)
    "type": "melee"             // 类型: melee/projectile/teleport/ultimate
  }
}
```

### 物理配置 (`assets/config/physics.json`)

```json
{
  "gravity": 980,               // 重力加速度(像素/秒²)
  "terminalVelocity": 1000,     // 最大下落速度
  "friction": 0.8,              // 地面摩擦系数(0-1)
  "knockback": {
    "force": 100,               // 击退力度
    "duration": 0.3             // 击退持续时间(秒)
  }
}
```

---

## Testing Checklist (测试清单)

在提交代码前,请确保以下测试通过:

### 单元测试
- [ ] 所有单元测试通过 (`npm run test`)
- [ ] 测试覆盖率 > 70%

### 功能测试
- [ ] 双人可以同时控制角色移动
- [ ] 所有技能(1-4)可正常释放并有冷却
- [ ] 角色受伤后生命值正确减少
- [ ] 死亡后在中间平台复活并有3秒无敌
- [ ] 用完复活次数后游戏结束并显示胜利画面
- [ ] 位置交换技能正常工作
- [ ] 角色可以从下往上穿过平台,从上往下站在平台上

### 性能测试
- [ ] 桌面浏览器保持60FPS(开发者工具中查看)
- [ ] 首屏加载时间 < 3秒
- [ ] 输入延迟 < 100ms(按键到角色响应)

### 兼容性测试
- [ ] Chrome浏览器正常运行
- [ ] Firefox浏览器正常运行
- [ ] Edge浏览器正常运行(可选)

---

## Next Steps (后续步骤)

完成快速入门后,你可以:

1. **开始实现任务**: 运行 `/speckit.tasks` 命令生成任务列表(tasks.md)
2. **阅读设计文档**:
   - [spec.md](./spec.md) - 功能规格说明
   - [plan.md](./plan.md) - 实施计划
   - [data-model.md](./data-model.md) - 数据模型
   - [research.md](./research.md) - 技术研究
3. **查看项目宪章**: [.specify/memory/constitution.md](../../.specify/memory/constitution.md)
4. **参与开发**:
   - 从 P1 优先级任务开始实现核心玩法
   - 遵循配置驱动原则,避免硬编码
   - 编写单元测试覆盖新功能
   - 提交前运行 `npm run lint` 检查代码规范

---

## Support & Resources (支持与资源)

### 文档
- [Vite 官方文档](https://vitejs.dev/)
- [Vitest 测试框架](https://vitest.dev/)
- [MDN Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

### 问题反馈
- 在项目仓库创建 Issue
- 标记相关标签(bug/enhancement/question)

### 代码审查
- 所有功能提交需要经过代码审查
- 审查重点:宪章合规性、测试覆盖、性能影响

---

**祝开发顺利! 🎮**
