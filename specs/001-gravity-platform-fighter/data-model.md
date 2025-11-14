# Phase 1: Data Model & Entity Design

**Feature**: 重力平台对战游戏
**Date**: 2025-10-12
**Status**: Completed

## Purpose

定义游戏中所有实体的数据结构和关系,确保配置驱动设计的实现。

---

## Core Entities

### 1. Character (角色)

**职责**: 表示游戏中的战斗单位,包含生命、位置、技能等状态。

**数据结构**:
```typescript
interface Character {
  // 身份信息
  id: string;                  // 唯一标识符(例如 "player1", "player2")
  type: 'A' | 'B';             // 角色类型(A或B)

  // 战斗属性
  health: number;              // 当前生命值(0-100)
  maxHealth: number;           // 最大生命值(100)
  respawns: number;            // 剩余复活次数(0-3)
  maxRespawns: number;         // 最大复活次数(3)
  isInvincible: boolean;       // 是否处于无敌状态
  invincibleTimer: number;     // 无敌剩余时间(秒)

  // 位置和移动
  position: Vector2;           // 当前位置(x, y)
  velocity: Vector2;           // 速度向量(x, y)
  facing: 'left' | 'right';    // 朝向
  isOnGround: boolean;         // 是否站在平台上

  // 技能状态
  skills: Skill[];             // 技能列表(4个技能)

  // 渲染相关
  sprite: string;              // 精灵图资源名称
  animations: Map<string, Animation>;  // 动画状态(idle, run, jump, attack)
  currentAnimation: string;    // 当前播放的动画

  // 碰撞盒
  hitbox: Rectangle;           // 碰撞检测矩形(相对位置)
}
```

**配置文件** (`assets/config/characters.json`):
```json
{
  "characterA": {
    "maxHealth": 100,
    "maxRespawns": 3,
    "invincibleDuration": 3.0,
    "moveSpeed": 200,
    "jumpForce": 500,
    "sprite": "characterA",
    "hitbox": { "width": 40, "height": 60, "offsetX": -20, "offsetY": -60 },
    "skills": [
      { "skillId": "melee", "key": 1 },
      { "skillId": "projectile", "key": 2 },
      { "skillId": "swap", "key": 3 },
      { "skillId": "ultimateA", "key": 4 }
    ]
  },
  "characterB": {
    "maxHealth": 100,
    "maxRespawns": 3,
    "invincibleDuration": 3.0,
    "moveSpeed": 200,
    "jumpForce": 500,
    "sprite": "characterB",
    "hitbox": { "width": 40, "height": 60, "offsetX": -20, "offsetY": -60 },
    "skills": [
      { "skillId": "melee", "key": 1 },
      { "skillId": "projectile", "key": 2 },
      { "skillId": "swap", "key": 3 },
      { "skillId": "ultimateB", "key": 4 }
    ]
  }
}
```

---

### 2. Skill (技能)

**职责**: 表示角色可使用的攻击能力,包含伤害、范围、冷却等属性。

**数据结构**:
```typescript
interface Skill {
  // 基本信息
  id: string;                  // 技能唯一标识符
  name: string;                // 技能名称(用于UI显示)
  description: string;         // 技能描述

  // 战斗属性
  damage: number;              // 伤害值
  range: number;               // 攻击范围(像素)
  angle: number;               // 攻击角度(弧度,如180度扇形 = Math.PI)

  // 冷却系统
  cooldown: number;            // 冷却时间(秒)
  currentCooldown: number;     // 当前冷却剩余时间(秒)

  // 技能类型
  type: 'melee' | 'projectile' | 'teleport' | 'ultimate';

  // 类型特定属性
  projectileSpeed?: number;    // 弹道速度(仅projectile类型)
  projectileLifetime?: number; // 弹道存在时间(秒)

  // 视觉效果
  visualEffect: string;        // 特效资源名称
  icon: string;                // 技能图标资源名称
}
```

**配置文件** (`assets/config/skills.json`):
```json
{
  "melee": {
    "name": "近战攻击",
    "description": "大范围短距离攻击",
    "damage": 10,
    "range": 100,
    "angle": 3.14159,
    "cooldown": 3.0,
    "type": "melee",
    "visualEffect": "melee_effect",
    "icon": "icon_melee"
  },
  "projectile": {
    "name": "远程弹道",
    "description": "小范围长距离弹道攻击",
    "damage": 30,
    "range": 1000,
    "angle": 1.0472,
    "cooldown": 5.0,
    "type": "projectile",
    "projectileSpeed": 600,
    "projectileLifetime": 2.0,
    "visualEffect": "projectile_effect",
    "icon": "icon_projectile"
  },
  "swap": {
    "name": "位置交换",
    "description": "与对手瞬间交换位置",
    "damage": 0,
    "range": 9999,
    "angle": 6.28318,
    "cooldown": 5.0,
    "type": "teleport",
    "visualEffect": "swap_effect",
    "icon": "icon_swap"
  },
  "ultimateA": {
    "name": "终极技(A)",
    "description": "小范围贯穿全屏80点伤害",
    "damage": 80,
    "range": 2000,
    "angle": 0.5236,
    "cooldown": 20.0,
    "type": "ultimate",
    "projectileSpeed": 1200,
    "projectileLifetime": 3.0,
    "visualEffect": "ultimate_a_effect",
    "icon": "icon_ultimate_a"
  },
  "ultimateB": {
    "name": "终极技(B)",
    "description": "中范围贯穿全屏40点伤害",
    "damage": 40,
    "range": 2000,
    "angle": 2.0944,
    "cooldown": 15.0,
    "type": "ultimate",
    "projectileSpeed": 1200,
    "projectileLifetime": 3.0,
    "visualEffect": "ultimate_b_effect",
    "icon": "icon_ultimate_b"
  }
}
```

---

### 3. Platform (平台)

**职责**: 表示固定的可站立区域。

**数据结构**:
```typescript
interface Platform {
  // 位置和尺寸
  position: Vector2;           // 平台左上角坐标
  width: number;               // 平台宽度
  height: number;              // 平台高度

  // 碰撞属性
  allowPassThrough: boolean;   // 是否允许从下往上穿过(true)

  // 视觉
  sprite: string;              // 平台纹理资源名称
}
```

**配置文件** (`assets/config/platforms.json`):
```json
{
  "platforms": [
    {
      "id": "left_top",
      "position": { "x": 150, "y": 200 },
      "width": 200,
      "height": 20,
      "allowPassThrough": true,
      "sprite": "platform_stone"
    },
    {
      "id": "center_bottom",
      "position": { "x": 350, "y": 400 },
      "width": 300,
      "height": 20,
      "allowPassThrough": true,
      "sprite": "platform_stone"
    },
    {
      "id": "right_top",
      "position": { "x": 700, "y": 200 },
      "width": 200,
      "height": 20,
      "allowPassThrough": true,
      "sprite": "platform_stone"
    }
  ],
  "screenWidth": 1024,
  "screenHeight": 768
}
```

---

### 4. MatchState (对战状态)

**职责**: 记录当前游戏的全局状态和进度。

**数据结构**:
```typescript
interface MatchState {
  // 游戏阶段
  phase: 'menu' | 'character_select' | 'battle' | 'victory';

  // 玩家选择
  player1Selection: 'A' | 'B' | null;
  player2Selection: 'A' | 'B' | null;

  // 对战数据
  player1Character: Character | null;
  player2Character: Character | null;

  // 胜负状态
  winner: 'player1' | 'player2' | null;

  // 时间追踪
  matchStartTime: number;      // 对战开始时间戳
  matchDuration: number;       // 对战持续时间(秒)
}
```

**不需要配置文件** (运行时状态)

---

### 5. Projectile (弹道/投射物)

**职责**: 表示技能发射的弹道(技能2和大招)。

**数据结构**:
```typescript
interface Projectile {
  // 基本信息
  id: string;                  // 唯一标识符
  ownerId: string;             // 发射者的Character.id
  skillId: string;             // 对应的技能ID

  // 物理属性
  position: Vector2;           // 当前位置
  velocity: Vector2;           // 速度向量
  damage: number;              // 伤害值
  range: number;               // 攻击范围(角度)

  // 生命周期
  lifetime: number;            // 最大存在时间(秒)
  age: number;                 // 当前存活时间(秒)
  isActive: boolean;           // 是否有效(击中后变为false)

  // 碰撞
  hitbox: Circle;              // 圆形碰撞检测

  // 视觉
  sprite: string;              // 弹道贴图
}
```

**不需要配置文件** (由Skill配置派生)

---

## Helper Types

### Vector2 (二维向量)

```typescript
interface Vector2 {
  x: number;
  y: number;
}
```

### Rectangle (矩形)

```typescript
interface Rectangle {
  x: number;       // 左上角x坐标
  y: number;       // 左上角y坐标
  width: number;
  height: number;
}
```

### Circle (圆形)

```typescript
interface Circle {
  x: number;       // 圆心x坐标
  y: number;       // 圆心y坐标
  radius: number;
}
```

### Animation (动画)

```typescript
interface Animation {
  frames: number[];         // 帧序号列表
  frameDuration: number;    // 每帧持续时间(秒)
  loop: boolean;            // 是否循环
}
```

---

## Physics Configuration

**配置文件** (`assets/config/physics.json`):
```json
{
  "gravity": 980,
  "terminalVelocity": 1000,
  "friction": 0.8,
  "knockback": {
    "force": 100,
    "duration": 0.3
  },
  "stabilizationTime": 0.5,
  "screenBounds": {
    "left": 0,
    "right": 1024,
    "top": 0,
    "bottom": 768
  }
}
```

**参数说明**:
- `gravity`: 重力加速度(像素/秒²)
- `terminalVelocity`: 最大下落速度
- `friction`: 地面摩擦系数(0-1)
- `knockback`: 受击击退参数
- `stabilizationTime`: 位置交换后的稳定时间(防止立即掉落)
- `screenBounds`: 屏幕边界(死亡判定)

---

## Input Configuration

**配置文件** (`assets/config/input.json`):
```json
{
  "player1": {
    "moveLeft": "KeyA",
    "moveRight": "KeyD",
    "jump": "KeyW",
    "skill1": "KeyQ",
    "skill2": "KeyE",
    "skill3": "KeyR",
    "skill4": "KeyF"
  },
  "player2": {
    "moveLeft": "ArrowLeft",
    "moveRight": "ArrowRight",
    "jump": "ArrowUp",
    "skill1": "KeyU",
    "skill2": "KeyI",
    "skill3": "KeyO",
    "skill4": "KeyP"
  },
  "debug": {
    "toggleDebugUI": "F12",
    "godMode": "F1",
    "resetCooldowns": "F2"
  }
}
```

---

## Asset Manifest

**配置文件** (`assets/config/assets.json`):
```json
{
  "images": [
    { "name": "characterA", "path": "/assets/images/characters/character_a.png" },
    { "name": "characterB", "path": "/assets/images/characters/character_b.png" },
    { "name": "platform_stone", "path": "/assets/images/platforms/platform.png" },
    { "name": "melee_effect", "path": "/assets/images/effects/melee.png" },
    { "name": "projectile_effect", "path": "/assets/images/effects/projectile.png" },
    { "name": "swap_effect", "path": "/assets/images/effects/swap.png" },
    { "name": "ultimate_a_effect", "path": "/assets/images/effects/ultimate_a.png" },
    { "name": "ultimate_b_effect", "path": "/assets/images/effects/ultimate_b.png" },
    { "name": "icon_melee", "path": "/assets/images/ui/skill_1.png" },
    { "name": "icon_projectile", "path": "/assets/images/ui/skill_2.png" },
    { "name": "icon_swap", "path": "/assets/images/ui/skill_3.png" },
    { "name": "icon_ultimate_a", "path": "/assets/images/ui/skill_4a.png" },
    { "name": "icon_ultimate_b", "path": "/assets/images/ui/skill_4b.png" }
  ],
  "audio": [
    { "name": "hit_sound", "path": "/assets/audio/sfx/hit.mp3" },
    { "name": "jump_sound", "path": "/assets/audio/sfx/jump.mp3" },
    { "name": "skill_sound", "path": "/assets/audio/sfx/skill.mp3" },
    { "name": "death_sound", "path": "/assets/audio/sfx/death.mp3" },
    { "name": "victory_sound", "path": "/assets/audio/sfx/victory.mp3" }
  ]
}
```

---

## Entity Relationships

```
MatchState
├── player1Character: Character
│   └── skills: Skill[]
└── player2Character: Character
    └── skills: Skill[]

BattleScene
├── characters: Character[]
├── platforms: Platform[]
└── projectiles: Projectile[]

Character
├── position: Vector2
├── velocity: Vector2
├── hitbox: Rectangle
└── skills: Skill[]

Skill → Projectile (spawns when used)
```

---

## Configuration Loading Flow

```
1. 游戏启动
   ↓
2. AssetLoader.loadAll(assets.json)
   - 加载所有图片和音频
   ↓
3. ConfigLoader.load()
   - 加载 characters.json
   - 加载 skills.json
   - 加载 platforms.json
   - 加载 physics.json
   - 加载 input.json
   ↓
4. 构建实体实例
   - Character实例(引用配置数据)
   - Skill实例(引用配置数据)
   - Platform实例(引用配置数据)
   ↓
5. 进入游戏循环
```

---

## Phase 1 Conclusion

✅ **所有实体和配置结构已定义完成。**

**关键设计决策**:
1. **完全配置驱动**: 所有游戏数值(伤害、冷却、位置)从JSON加载
2. **类型安全**: 使用TypeScript接口定义数据结构(可选,JavaScript也适用)
3. **模块化**: 实体职责明确,易于测试和扩展
4. **资源管理**: 统一的资源清单(assets.json)和预加载流程

**下一步**: Phase 1 - 生成快速入门文档(Quickstart Guide)
