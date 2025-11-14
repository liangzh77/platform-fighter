/**
 * 二维向量类
 */
export class Vector2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  /**
   * 向量加法
   */
  add(v) {
    return new Vector2(this.x + v.x, this.y + v.y);
  }

  /**
   * 向量减法
   */
  subtract(v) {
    return new Vector2(this.x - v.x, this.y - v.y);
  }

  /**
   * 标量乘法
   */
  multiply(scalar) {
    return new Vector2(this.x * scalar, this.y * scalar);
  }

  /**
   * 向量长度
   */
  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  /**
   * 归一化向量
   */
  normalize() {
    const len = this.length();
    if (len === 0) return new Vector2(0, 0);
    return new Vector2(this.x / len, this.y / len);
  }

  /**
   * 点积
   */
  dot(v) {
    return this.x * v.x + this.y * v.y;
  }

  /**
   * 距离
   */
  distanceTo(v) {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * 克隆
   */
  clone() {
    return new Vector2(this.x, this.y);
  }
}

/**
 * 矩形类(用于碰撞检测)
 */
export class Rectangle {
  constructor(x = 0, y = 0, width = 0, height = 0) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  /**
   * AABB碰撞检测
   */
  intersects(other) {
    return (
      this.x < other.x + other.width &&
      this.x + this.width > other.x &&
      this.y < other.y + other.height &&
      this.y + this.height > other.y
    );
  }

  /**
   * 包含点检测
   */
  containsPoint(x, y) {
    return x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height;
  }

  /**
   * 获取中心点
   */
  getCenter() {
    return new Vector2(this.x + this.width / 2, this.y + this.height / 2);
  }
}

/**
 * 圆形类(用于技能范围检测)
 */
export class Circle {
  constructor(x = 0, y = 0, radius = 0) {
    this.x = x;
    this.y = y;
    this.radius = radius;
  }

  /**
   * 圆形与点的碰撞
   */
  containsPoint(x, y) {
    const dx = x - this.x;
    const dy = y - this.y;
    return dx * dx + dy * dy <= this.radius * this.radius;
  }

  /**
   * 圆形与圆形的碰撞
   */
  intersects(other) {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < this.radius + other.radius;
  }

  /**
   * 圆形与矩形的碰撞
   */
  intersectsRect(rect) {
    // 找到矩形上最接近圆心的点
    const closestX = Math.max(rect.x, Math.min(this.x, rect.x + rect.width));
    const closestY = Math.max(rect.y, Math.min(this.y, rect.y + rect.height));

    // 计算距离
    const dx = this.x - closestX;
    const dy = this.y - closestY;

    return dx * dx + dy * dy < this.radius * this.radius;
  }
}

/**
 * 数学工具函数
 */
export const MathUtils = {
  /**
   * 限制值在min和max之间
   */
  clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  },

  /**
   * 线性插值
   */
  lerp(start, end, t) {
    return start + (end - start) * t;
  },

  /**
   * 将角度转换为弧度
   */
  degToRad(degrees) {
    return (degrees * Math.PI) / 180;
  },

  /**
   * 将弧度转换为角度
   */
  radToDeg(radians) {
    return (radians * 180) / Math.PI;
  },

  /**
   * 检查值是否在范围内
   */
  inRange(value, min, max) {
    return value >= min && value <= max;
  },

  /**
   * 随机整数
   */
  randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  /**
   * 随机浮点数
   */
  randomFloat(min, max) {
    return Math.random() * (max - min) + min;
  },
};
