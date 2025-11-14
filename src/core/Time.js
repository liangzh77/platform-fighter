/**
 * 时间管理类
 */
export class Time {
  constructor() {
    this.deltaTime = 0;
    this.lastTime = 0;
    this.timeScale = 1.0;
    this.totalTime = 0;
  }

  /**
   * 更新时间
   */
  update(currentTime) {
    if (this.lastTime === 0) {
      this.lastTime = currentTime;
    }

    const rawDelta = (currentTime - this.lastTime) / 1000; // 转换为秒
    this.deltaTime = rawDelta * this.timeScale;
    this.totalTime += this.deltaTime;
    this.lastTime = currentTime;

    // 限制deltaTime避免大幅跳跃
    if (this.deltaTime > 0.1) {
      this.deltaTime = 0.1;
    }
  }

  /**
   * 重置时间
   */
  reset() {
    this.deltaTime = 0;
    this.lastTime = 0;
    this.totalTime = 0;
  }

  /**
   * 设置时间缩放
   */
  setTimeScale(scale) {
    this.timeScale = Math.max(0, scale);
  }
}
