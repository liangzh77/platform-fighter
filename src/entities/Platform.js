import { Vector2 } from '../utils/Math.js';

/**
 * 平台类
 */
export class Platform {
  constructor(config) {
    this.id = config.id;
    this.position = new Vector2(config.position.x, config.position.y);
    this.width = config.width;
    this.height = config.height;
    this.allowPassThrough = config.allowPassThrough;
    this.sprite = config.sprite;
  }

  /**
   * 渲染平台
   */
  render(ctx, debug) {
    // 绘制平台(简单矩形)
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);

    // 平台边缘高亮
    ctx.fillStyle = '#A0522D';
    ctx.fillRect(this.position.x, this.position.y, this.width, 3);

    // 调试:碰撞盒
    if (debug && debug.showHitboxes) {
      debug.renderHitbox(
        ctx,
        this.position.x,
        this.position.y,
        this.width,
        this.height,
        'green'
      );
    }
  }
}
