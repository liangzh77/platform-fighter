import { Rectangle } from '../utils/Math.js';
import { logger } from '../utils/Logger.js';

/**
 * 物理引擎
 */
export class PhysicsEngine {
  constructor(physicsConfig) {
    this.gravity = physicsConfig.gravity;
    this.terminalVelocity = physicsConfig.terminalVelocity;
    this.friction = physicsConfig.friction;
    this.knockbackForce = physicsConfig.knockback.force;
    this.knockbackDuration = physicsConfig.knockback.duration;
    this.screenBounds = physicsConfig.screenBounds;

    logger.debug('PhysicsEngine initialized', physicsConfig);
  }

  /**
   * 应用重力
   */
  applyGravity(character, deltaTime) {
    if (character.isOnGround) return;

    character.velocity.y += this.gravity * deltaTime;

    // 限制最大下落速度
    if (character.velocity.y > this.terminalVelocity) {
      character.velocity.y = this.terminalVelocity;
    }
  }

  /**
   * 应用摩擦力
   */
  applyFriction(character, deltaTime) {
    if (!character.isOnGround) return;

    character.velocity.x *= this.friction;

    // 速度很小时归零
    if (Math.abs(character.velocity.x) < 1) {
      character.velocity.x = 0;
    }
  }

  /**
   * 更新位置
   */
  updatePosition(character, deltaTime) {
    character.position.x += character.velocity.x * deltaTime;
    character.position.y += character.velocity.y * deltaTime;
  }

  /**
   * AABB碰撞检测
   */
  checkCollision(rect1, rect2) {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  }

  /**
   * 平台碰撞检测(从下往上穿过,从上往下站立)
   */
  checkPlatformCollision(character, platform) {
    const config = character.config;

    // 角色的实际碰撞盒位置
    const charLeft = character.position.x + config.hitbox.offsetX;
    const charRight = charLeft + config.hitbox.width;
    const charTop = character.position.y + config.hitbox.offsetY;
    const charBottom = charTop + config.hitbox.height;

    // 平台范围
    const platLeft = platform.position.x;
    const platRight = platform.position.x + platform.width;
    const platTop = platform.position.y;
    const platBottom = platform.position.y + platform.height;

    // 检查水平重叠
    if (charRight <= platLeft || charLeft >= platRight) {
      return false; // 水平方向没有重叠
    }

    // 检查角色是否在平台上方且向下移动
    if (character.velocity.y >= 0) {
      // 角色底部距离平台顶部的距离
      const distance = platTop - charBottom;

      // 如果距离很小(即将接触或刚接触)
      if (distance >= -5 && distance <= 10) {
        // 站在平台上
        character.position.y = platTop - config.hitbox.height - config.hitbox.offsetY;
        character.velocity.y = 0;
        character.isOnGround = true;
        return true;
      }
    }

    return false;
  }

  /**
   * 获取角色碰撞盒
   */
  getCharacterHitbox(character) {
    const config = character.config;
    return new Rectangle(
      character.position.x + config.hitbox.offsetX,
      character.position.y + config.hitbox.offsetY,
      config.hitbox.width,
      config.hitbox.height
    );
  }

  /**
   * 检查是否离开平台
   */
  checkLeftPlatform(character, platforms) {
    const charRect = this.getCharacterHitbox(character);
    const charCenterX = charRect.x + charRect.width / 2;
    const charBottom = charRect.y + charRect.height + 5; // 稍微往下一点

    for (const platform of platforms) {
      if (
        charBottom >= platform.position.y &&
        charBottom <= platform.position.y + platform.height + 10 &&
        charCenterX >= platform.position.x &&
        charCenterX <= platform.position.x + platform.width
      ) {
        return false; // 还在平台上
      }
    }

    return true; // 已离开平台
  }

  /**
   * 应用击退
   */
  applyKnockback(character, direction) {
    character.velocity.x = direction * this.knockbackForce;
    character.knockbackTimer = this.knockbackDuration;
  }

  /**
   * 检查屏幕边界
   */
  isOutOfBounds(character) {
    const pos = character.position;
    return (
      pos.x < this.screenBounds.left - 50 ||
      pos.x > this.screenBounds.right + 50 ||
      pos.y > this.screenBounds.bottom + 50
    );
  }
}
