import { logger } from './Logger.js';

/**
 * 调试工具类
 */
export class Debug {
  constructor(game) {
    this.game = game;
    this.enabled = false;
    this.showFPS = false;
    this.showHitboxes = false;
    this.showSkillRanges = false;
    this.godMode = false;

    // FPS追踪
    this.fps = 60;
    this.frameTimes = [];
    this.lastTime = performance.now();
  }

  /**
   * 切换调试UI
   */
  toggleDebugUI() {
    this.showFPS = !this.showFPS;
    logger.info(`Debug UI: ${this.showFPS ? 'ON' : 'OFF'}`);
  }

  /**
   * 切换无敌模式
   */
  toggleGodMode() {
    this.godMode = !this.godMode;
    logger.info(`God Mode: ${this.godMode ? 'ON' : 'OFF'}`);
  }

  /**
   * 重置技能冷却
   */
  resetCooldowns() {
    // 实现由BattleScene调用
    logger.info('Cooldowns reset');
  }

  /**
   * 切换碰撞盒显示
   */
  toggleHitboxes() {
    this.showHitboxes = !this.showHitboxes;
    logger.info(`Show Hitboxes: ${this.showHitboxes ? 'ON' : 'OFF'}`);
  }

  /**
   * 切换技能范围显示
   */
  toggleSkillRanges() {
    this.showSkillRanges = !this.showSkillRanges;
    logger.info(`Show Skill Ranges: ${this.showSkillRanges ? 'ON' : 'OFF'}`);
  }

  /**
   * 更新FPS
   */
  update() {
    const now = performance.now();
    const delta = now - this.lastTime;
    this.lastTime = now;

    this.frameTimes.push(delta);
    if (this.frameTimes.length > 60) {
      this.frameTimes.shift();
    }

    if (this.frameTimes.length > 0) {
      const avgFrameTime =
        this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
      this.fps = Math.round(1000 / avgFrameTime);
    }
  }

  /**
   * 渲染调试信息
   */
  render(ctx) {
    if (!this.showFPS) return;

    ctx.save();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, 10, 150, 80);

    ctx.fillStyle = '#00ff00';
    ctx.font = '14px monospace';
    ctx.fillText(`FPS: ${this.fps}`, 20, 30);
    ctx.fillText(`God Mode: ${this.godMode ? 'ON' : 'OFF'}`, 20, 50);

    if (this.game && this.game.currentScene) {
      const scene = this.game.currentScene;
      ctx.fillText(`Scene: ${scene.constructor.name}`, 20, 70);
    }

    ctx.restore();
  }

  /**
   * 渲染碰撞盒
   */
  renderHitbox(ctx, x, y, width, height, color = 'red') {
    if (!this.showHitboxes) return;

    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);
    ctx.restore();
  }

  /**
   * 渲染技能范围
   */
  renderSkillRange(ctx, x, y, range, angle, facing) {
    if (!this.showSkillRanges) return;

    ctx.save();
    ctx.strokeStyle = 'yellow';
    ctx.fillStyle = 'rgba(255, 255, 0, 0.2)';
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.arc(x, y, range, facing - angle / 2, facing + angle / 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }
}
