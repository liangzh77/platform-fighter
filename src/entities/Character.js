import { Vector2 } from '../utils/Math.js';
import { logger } from '../utils/Logger.js';

/**
 * 角色类
 */
export class Character {
  constructor(id, type, config, skillsConfig) {
    this.id = id; // 'player1' or 'player2'
    this.type = type; // 'characterA' or 'characterB'
    this.config = config;

    // 战斗属性
    this.health = config.maxHealth;
    this.maxHealth = config.maxHealth;
    this.respawns = config.maxRespawns;
    this.maxRespawns = config.maxRespawns;
    this.isInvincible = false;
    this.invincibleTimer = 0;

    // 位置和移动
    this.position = new Vector2(0, 0);
    this.velocity = new Vector2(0, 0);
    this.facing = 'right';
    this.isOnGround = false;

    // 状态
    this.isDead = false;
    this.knockbackTimer = 0;
    this.stabilizationTimer = 0;

    // 技能
    this.skills = [];
    this.loadSkills(config.skills, skillsConfig);

    logger.debug(`Character created: ${id} (${type})`);
  }

  /**
   * 加载技能
   */
  loadSkills(skillSlots, skillsConfig) {
    skillSlots.forEach((slot) => {
      const skillTemplate = skillsConfig[slot.skillId];
      if (skillTemplate) {
        this.skills.push({
          id: slot.skillId,
          ...skillTemplate,
          currentCooldown: 0,
        });
      }
    });
  }

  /**
   * 更新角色状态
   */
  update(deltaTime) {
    // 更新无敌时间
    if (this.invincibleTimer > 0) {
      this.invincibleTimer -= deltaTime;
      if (this.invincibleTimer <= 0) {
        this.invincibleTimer = 0;
        this.isInvincible = false;
      }
    }

    // 更新击退时间
    if (this.knockbackTimer > 0) {
      this.knockbackTimer -= deltaTime;
      if (this.knockbackTimer <= 0) {
        this.knockbackTimer = 0;
      }
    }

    // 更新稳定时间
    if (this.stabilizationTimer > 0) {
      this.stabilizationTimer -= deltaTime;
      if (this.stabilizationTimer <= 0) {
        this.stabilizationTimer = 0;
      }
    }
  }

  /**
   * 移动
   */
  move(direction) {
    if (this.knockbackTimer > 0) return; // 击退中不能移动

    this.velocity.x = direction * this.config.moveSpeed;

    // 更新朝向
    if (direction > 0) {
      this.facing = 'right';
    } else if (direction < 0) {
      this.facing = 'left';
    }
  }

  /**
   * 跳跃
   */
  jump() {
    if (!this.isOnGround || this.knockbackTimer > 0) return;

    this.velocity.y = -this.config.jumpForce;
    this.isOnGround = false;
  }

  /**
   * 受到伤害
   */
  takeDamage(amount, attacker = null) {
    if (this.isInvincible || this.isDead) return;

    this.health -= amount;
    logger.debug(`${this.id} took ${amount} damage, health: ${this.health}`);

    if (this.health <= 0) {
      this.health = 0;
      this.die(attacker);
    }

    // 计算击退方向
    if (attacker) {
      const direction = this.position.x > attacker.position.x ? 1 : -1;
      this.knockbackTimer = 0.3;
      this.velocity.x = direction * 100;
    }
  }

  /**
   * 死亡
   */
  die(attacker = null) {
    if (this.respawns > 0) {
      this.isDead = true;
      this.lastAttacker = attacker; // 记录最后的攻击者
      logger.info(`${this.id} died, respawns left: ${this.respawns}`);
    } else {
      this.lastAttacker = attacker;
      logger.info(`${this.id} lost the match!`);
    }
  }

  /**
   * 复活
   */
  respawn(x, y) {
    if (this.respawns <= 0) return false;

    this.respawns--;
    this.health = this.maxHealth;
    this.position.x = x;
    this.position.y = y;
    this.velocity.x = 0;
    this.velocity.y = 0;
    this.isDead = false;

    // 无敌时间
    this.isInvincible = true;
    this.invincibleTimer = this.config.invincibleDuration;

    logger.info(`${this.id} respawned, respawns left: ${this.respawns}`);
    return true;
  }

  /**
   * 渲染角色
   */
  render(ctx, debug) {
    // 闪烁效果(无敌状态)
    if (this.isInvincible && Math.floor(Date.now() / 100) % 2 === 0) {
      return; // 每100ms切换显示/隐藏
    }

    // 绘制角色(简单矩形表示)
    const color = this.type === 'characterA' ? '#ff6b6b' : '#4ecdc4';
    ctx.fillStyle = color;

    const hitbox = this.config.hitbox;
    ctx.fillRect(
      this.position.x + hitbox.offsetX,
      this.position.y + hitbox.offsetY,
      hitbox.width,
      hitbox.height
    );

    // 绘制朝向指示
    ctx.fillStyle = '#fff';
    const indicatorX =
      this.facing === 'right'
        ? this.position.x + hitbox.offsetX + hitbox.width
        : this.position.x + hitbox.offsetX;
    ctx.fillRect(indicatorX - 5, this.position.y + hitbox.offsetY + 10, 10, 5);

    // 调试:碰撞盒
    if (debug && debug.showHitboxes) {
      debug.renderHitbox(
        ctx,
        this.position.x + hitbox.offsetX,
        this.position.y + hitbox.offsetY,
        hitbox.width,
        hitbox.height,
        this.isInvincible ? 'blue' : 'red'
      );
    }
  }
}
