# Phase 0: Research & Technical Exploration

**Feature**: 重力平台对战游戏
**Date**: 2025-10-12
**Status**: Completed

## Purpose

在开始设计和编码前,识别并研究未知的技术领域,降低实施风险。

## Research Areas

### 1. HTML5 Canvas 游戏循环架构

**问题**: 如何实现稳定的60FPS游戏循环?

**研究结果**:
- 使用 `requestAnimationFrame(callback)` 代替 `setInterval`
- 实现固定时间步长(Fixed Timestep)模式:
  ```javascript
  let lastTime = 0;
  const targetFPS = 60;
  const timestep = 1000 / targetFPS;

  function gameLoop(currentTime) {
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    // 更新游戏逻辑(固定时间步长)
    update(timestep / 1000); // 转换为秒

    // 渲染
    render();

    requestAnimationFrame(gameLoop);
  }
  ```

**参考资源**:
- [MDN: requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
- Game Programming Patterns: "Game Loop" chapter

**风险评估**: ✅ 低风险 - 标准技术,广泛支持

---

### 2. 碰撞检测算法

**问题**: 如何高效检测技能命中和平台碰撞?

**研究结果**:
- **矩形碰撞(AABB)**: 用于角色与平台
  ```javascript
  function isColliding(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
  }
  ```
- **圆形/扇形范围检测**: 用于技能范围
  ```javascript
  function isInSkillRange(attacker, target, skillRange, skillAngle) {
    const dx = target.x - attacker.x;
    const dy = target.y - attacker.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx);

    return distance <= skillRange &&
           Math.abs(angle - attacker.facing) <= skillAngle / 2;
  }
  ```

**优化策略**:
- 由于只有2个角色和3个平台,无需复杂的空间分区(Spatial Partitioning)
- 简单的O(n²)检测足够高效

**风险评估**: ✅ 低风险 - 简单场景,算法成熟

---

### 3. 输入处理:同时支持两名玩家

**问题**: 如何在同一键盘上同时捕获两名玩家的输入?

**研究结果**:
- 使用 `keydown` 和 `keyup` 事件维护按键状态表
  ```javascript
  const keysPressed = new Set();

  window.addEventListener('keydown', (e) => {
    keysPressed.add(e.code);
  });

  window.addEventListener('keyup', (e) => {
    keysPressed.delete(e.code);
  });

  // 在游戏循环中查询
  if (keysPressed.has('KeyW')) {
    player1.jump();
  }
  if (keysPressed.has('ArrowUp')) {
    player2.jump();
  }
  ```

**按键映射**:
- **玩家1**: WASD移动, Q技能1, E技能2, R技能3, F大招, Space跳跃
- **玩家2**: 方向键移动, U技能1, I技能2, O技能3, P大招, Enter跳跃

**注意事项**:
- 某些键盘存在"按键冲突"(Key Rollover限制),需测试常见键盘
- 避免使用功能键(F1-F12)和系统快捷键(Ctrl+W等)

**风险评估**: ⚠️ 中风险 - 需测试不同键盘硬件

---

### 4. 配置热加载(Hot Reload)

**问题**: 如何在开发时修改配置文件后无需刷新页面?

**研究结果**:
- **开发模式**: Vite自带HMR(Hot Module Replacement)
  ```javascript
  // ConfigLoader.js
  export class ConfigLoader {
    async loadConfig(path) {
      const response = await fetch(path);
      return response.json();
    }
  }

  // Vite HMR支持
  if (import.meta.hot) {
    import.meta.hot.accept('./config/skills.json', (newModule) => {
      game.reloadConfig(newModule);
    });
  }
  ```

**生产模式**:
- 配置文件打包进bundle,无需热加载

**风险评估**: ✅ 低风险 - Vite原生支持

---

### 5. 性能监控和FPS显示

**问题**: 如何在开发模式下监控游戏性能?

**研究结果**:
- 使用 `performance.now()` 测量帧时间
  ```javascript
  class PerformanceMonitor {
    constructor() {
      this.frames = [];
      this.lastTime = performance.now();
    }

    update() {
      const now = performance.now();
      const frameTime = now - this.lastTime;
      this.frames.push(frameTime);

      if (this.frames.length > 60) {
        this.frames.shift();
      }

      this.lastTime = now;
    }

    getFPS() {
      const avgFrameTime = this.frames.reduce((a, b) => a + b, 0) / this.frames.length;
      return 1000 / avgFrameTime;
    }
  }
  ```

**调试UI**:
- 使用Canvas绘制FPS数字,避免DOM操作影响性能
- 显示实体数量、内存使用(via `performance.memory`)

**风险评估**: ✅ 低风险 - 标准技术

---

### 6. 渲染优化:避免过度绘制

**问题**: 如何减少Canvas渲染调用次数?

**研究结果**:
- **分层渲染**: 静态背景和动态对象分离
  ```javascript
  // 只在游戏开始时绘制一次背景
  function renderBackground(ctx) {
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制平台(静态)
    platforms.forEach(platform => platform.render(ctx));
  }

  // 每帧只绘制动态对象
  function renderDynamic(ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    characters.forEach(char => char.render(ctx));
    skills.forEach(skill => skill.render(ctx));
  }
  ```

**精灵图(Sprite Sheet)**:
- 将角色动画帧合并为单张图片,减少HTTP请求
- 使用 `drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)` 绘制子区域

**风险评估**: ✅ 低风险 - 标准优化技术

---

### 7. 状态管理:场景切换

**问题**: 如何管理菜单、角色选择、对战、胜利等场景?

**研究结果**:
- **状态机模式(State Machine)**
  ```javascript
  class StateManager {
    constructor() {
      this.currentState = null;
      this.states = new Map();
    }

    registerState(name, state) {
      this.states.set(name, state);
    }

    changeState(name) {
      if (this.currentState) {
        this.currentState.onExit();
      }

      this.currentState = this.states.get(name);
      this.currentState.onEnter();
    }

    update(deltaTime) {
      if (this.currentState) {
        this.currentState.update(deltaTime);
      }
    }

    render(ctx) {
      if (this.currentState) {
        this.currentState.render(ctx);
      }
    }
  }

  // 使用示例
  class MenuState {
    onEnter() { /* 初始化菜单 */ }
    onExit() { /* 清理资源 */ }
    update(dt) { /* 更新逻辑 */ }
    render(ctx) { /* 绘制菜单 */ }
  }
  ```

**场景列表**:
1. MenuState - 主菜单
2. CharacterSelectState - 角色选择
3. BattleState - 对战场景
4. VictoryState - 胜利画面

**风险评估**: ✅ 低风险 - 经典设计模式

---

### 8. 资源预加载

**问题**: 如何避免游戏中途加载资源导致卡顿?

**研究结果**:
- **启动时预加载所有资源**
  ```javascript
  class AssetLoader {
    constructor() {
      this.assets = new Map();
    }

    async loadImage(name, path) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          this.assets.set(name, img);
          resolve(img);
        };
        img.onerror = reject;
        img.src = path;
      });
    }

    async loadAll(manifest) {
      const promises = manifest.images.map(item =>
        this.loadImage(item.name, item.path)
      );
      await Promise.all(promises);
    }

    get(name) {
      return this.assets.get(name);
    }
  }

  // 使用
  const loader = new AssetLoader();
  await loader.loadAll({
    images: [
      { name: 'characterA', path: '/assets/images/characters/A.png' },
      { name: 'characterB', path: '/assets/images/characters/B.png' },
      { name: 'platform', path: '/assets/images/platforms/platform.png' }
    ]
  });
  ```

**加载界面**:
- 显示进度条(已加载 / 总数)
- 显示当前加载的资源名称

**风险评估**: ✅ 低风险 - 常见实践

---

## Unknown Technical Risks

| 风险项 | 严重性 | 缓解策略 |
|--------|--------|----------|
| 键盘按键冲突(Key Rollover) | 中 | 提供可自定义按键绑定;建议使用外设键盘 |
| 移动端虚拟按键体验差 | 低 | 优先保证桌面体验;移动端标记为实验性功能 |
| 不同浏览器Canvas性能差异 | 低 | 测试Chrome/Firefox/Safari;降低移动端目标帧率到30FPS |

---

## Technical Decisions

| 决策项 | 选择方案 | 理由 |
|--------|----------|------|
| 渲染引擎 | 原生Canvas API | 项目简单,避免引入重型库(Phaser/PixiJS);减少包体积 |
| 构建工具 | Vite | 快速热更新,零配置,TypeScript支持 |
| 物理引擎 | 自定义(简单重力+碰撞) | 无需复杂物理模拟(刚体、摩擦力),避免过度依赖 |
| 状态管理 | 状态机模式 | 场景清晰,便于测试和扩展 |
| 测试框架 | Vitest | 与Vite集成良好,API类似Jest |
| 类型检查 | TypeScript(可选) | 提高代码健壮性,但不强制(保持灵活性) |

---

## Phase 0 Conclusion

✅ **所有关键技术点已研究完毕,无阻塞性未知风险。**

**关键发现**:
1. 游戏循环、碰撞检测、输入处理均为成熟技术
2. 性能优化策略明确(分层渲染、精灵图、固定时间步长)
3. 中风险项(键盘冲突)可通过自定义按键绑定缓解

**下一步**: 进入Phase 1 - 数据模型设计和API契约定义(跳过API,仅数据模型)
