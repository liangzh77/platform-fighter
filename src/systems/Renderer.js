/**
 * 渲染器
 */
export class Renderer {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.width = canvas.width;
    this.height = canvas.height;
  }

  /**
   * 清空画布
   */
  clear(color = '#1a1a2e') {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  /**
   * 绘制矩形
   */
  drawRect(x, y, width, height, color = '#fff') {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, width, height);
  }

  /**
   * 绘制描边矩形
   */
  drawStrokeRect(x, y, width, height, color = '#fff', lineWidth = 2) {
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeRect(x, y, width, height);
  }

  /**
   * 绘制圆形
   */
  drawCircle(x, y, radius, color = '#fff') {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.fill();
  }

  /**
   * 绘制文本
   */
  drawText(text, x, y, font = '16px Arial', color = '#fff', align = 'left') {
    this.ctx.fillStyle = color;
    this.ctx.font = font;
    this.ctx.textAlign = align;
    this.ctx.fillText(text, x, y);
  }

  /**
   * 绘制图片
   */
  drawImage(image, x, y, width = null, height = null) {
    if (width && height) {
      this.ctx.drawImage(image, x, y, width, height);
    } else {
      this.ctx.drawImage(image, x, y);
    }
  }

  /**
   * 绘制精灵图的一部分
   */
  drawSprite(image, sx, sy, sw, sh, dx, dy, dw, dh) {
    this.ctx.drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);
  }

  /**
   * 设置透明度
   */
  setAlpha(alpha) {
    this.ctx.globalAlpha = alpha;
  }

  /**
   * 重置透明度
   */
  resetAlpha() {
    this.ctx.globalAlpha = 1.0;
  }

  /**
   * 保存画布状态
   */
  save() {
    this.ctx.save();
  }

  /**
   * 恢复画布状态
   */
  restore() {
    this.ctx.restore();
  }
}
