import { logger } from '../utils/Logger.js';

/**
 * 技能系统
 */
export class SkillSystem {
  constructor(skillsConfig) {
    this.skillsConfig = skillsConfig;
    this.projectiles = [];
    this.visualEffects = []; // 存储视觉特效

    logger.debug('SkillSystem initialized');
  }

  /**
   * 更新所有技能冷却
   */
  updateCooldowns(character, deltaTime) {
    if (!character.skills) return;

    character.skills.forEach((skill) => {
      if (skill.currentCooldown > 0) {
        skill.currentCooldown -= deltaTime;
        if (skill.currentCooldown < 0) {
          skill.currentCooldown = 0;
        }
      }
    });
  }

  /**
   * 使用技能
   */
  useSkill(character, skillIndex, target = null) {
    if (!character.skills || !character.skills[skillIndex]) {
      logger.warn(`Skill not found: index ${skillIndex}`);
      return false;
    }

    const skill = character.skills[skillIndex];

    // 检查冷却
    if (skill.currentCooldown > 0) {
      return false;
    }

    // 开始冷却
    skill.currentCooldown = skill.cooldown;

    logger.debug(`${character.id} used skill: ${skill.name}`);

    // 根据技能类型执行不同逻辑
    switch (skill.type) {
      case 'melee':
        return this.executeMelee(character, skill, target);
      case 'projectile':
      case 'ultimate':
        return this.executeProjectile(character, skill);
      case 'teleport':
        return this.executeTeleport(character, target);
      default:
        logger.warn(`Unknown skill type: ${skill.type}`);
        return false;
    }
  }

  /**
   * 执行近战攻击
   */
  executeMelee(character, skill, target) {
    if (!target) return false;

    // 创建冲击波特效
    this.createMeleeEffect(character, skill);

    // 计算距离
    const dx = target.position.x - character.position.x;
    const dy = target.position.y - character.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // 检查是否在范围内（360度，不检查朝向）
    if (distance > skill.range) {
      return false;
    }

    // 应用伤害并创建击中特效
    if (target.takeDamage) {
      target.takeDamage(skill.damage, character);
      this.createHitEffect(target);
      return true;
    }

    return false;
  }

  /**
   * 创建近战冲击波特效
   */
  createMeleeEffect(character, skill) {
    const effect = {
      type: 'melee_shockwave',
      position: { x: character.position.x, y: character.position.y },
      radius: 0,
      maxRadius: skill.range,
      duration: 0.3, // 持续0.3秒
      age: 0,
      color: '#ffff00', // 黄色
    };
    this.visualEffects.push(effect);
  }

  /**
   * 创建击中特效
   */
  createHitEffect(target) {
    const effect = {
      type: 'hit_impact',
      position: { x: target.position.x, y: target.position.y - 30 },
      duration: 0.4,
      age: 0,
      particles: [],
    };

    // 创建多个粒子效果
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8;
      effect.particles.push({
        x: 0,
        y: 0,
        vx: Math.cos(angle) * 150,
        vy: Math.sin(angle) * 150,
      });
    }

    this.visualEffects.push(effect);
  }

  /**
   * 执行弹道技能
   */
  executeProjectile(character, skill) {
    const direction = character.facing === 'right' ? 1 : -1;

    const projectile = {
      id: `proj_${Date.now()}`,
      ownerId: character.id,
      skillId: skill.id,
      position: { x: character.position.x, y: character.position.y - 30 },
      velocity: {
        x: direction * skill.projectileSpeed,
        y: 0,
      },
      damage: skill.damage,
      range: skill.range,
      angle: skill.angle,
      lifetime: skill.projectileLifetime,
      age: 0,
      isActive: true,
    };

    this.projectiles.push(projectile);
    return true;
  }

  /**
   * 执行位置交换
   */
  executeTeleport(character, target) {
    if (!target) return false;

    // 交换位置
    const tempX = character.position.x;
    const tempY = character.position.y;
    character.position.x = target.position.x;
    character.position.y = target.position.y;
    target.position.x = tempX;
    target.position.y = tempY;

    // 交换速度
    const tempVelX = character.velocity.x;
    const tempVelY = character.velocity.y;
    character.velocity.x = target.velocity.x;
    character.velocity.y = target.velocity.y;
    target.velocity.x = tempVelX;
    target.velocity.y = tempVelY;

    return true;
  }

  /**
   * 更新所有弹道
   */
  updateProjectiles(deltaTime, characters) {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const proj = this.projectiles[i];

      // 更新位置
      proj.position.x += proj.velocity.x * deltaTime;
      proj.position.y += proj.velocity.y * deltaTime;

      // 更新年龄
      proj.age += deltaTime;

      // 检查超时
      if (proj.age >= proj.lifetime) {
        this.projectiles.splice(i, 1);
        continue;
      }

      // 检查命中
      for (const char of characters) {
        if (char.id === proj.ownerId) continue; // 不能打到自己
        if (!char.takeDamage) continue;

        const dx = char.position.x - proj.position.x;
        const dy = char.position.y - proj.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 40) {
          // 简化的碰撞检测
          char.takeDamage(proj.damage, null);
          this.projectiles.splice(i, 1);
          break;
        }
      }
    }
  }

  /**
   * 更新所有视觉特效
   */
  updateVisualEffects(deltaTime) {
    for (let i = this.visualEffects.length - 1; i >= 0; i--) {
      const effect = this.visualEffects[i];
      effect.age += deltaTime;

      // 更新冲击波半径（扩散效果）
      if (effect.type === 'melee_shockwave') {
        const progress = effect.age / effect.duration;
        effect.radius = effect.maxRadius * progress;
      }

      // 更新击中特效粒子
      if (effect.type === 'hit_impact') {
        effect.particles.forEach((particle) => {
          particle.x += particle.vx * deltaTime;
          particle.y += particle.vy * deltaTime;
        });
      }

      // 移除过期特效
      if (effect.age >= effect.duration) {
        this.visualEffects.splice(i, 1);
      }
    }
  }

  /**
   * 渲染所有弹道
   */
  renderProjectiles(ctx) {
    this.projectiles.forEach((proj) => {
      ctx.fillStyle = '#ffff00';
      ctx.beginPath();
      ctx.arc(proj.position.x, proj.position.y, 8, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  /**
   * 渲染所有视觉特效
   */
  renderVisualEffects(ctx) {
    this.visualEffects.forEach((effect) => {
      if (effect.type === 'melee_shockwave') {
        const progress = effect.age / effect.duration;
        const alpha = 1 - progress; // 逐渐变透明

        // 绘制扩散的冲击波圆环
        ctx.strokeStyle = `rgba(255, 255, 0, ${alpha})`;
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(effect.position.x, effect.position.y, effect.radius, 0, Math.PI * 2);
        ctx.stroke();

        // 绘制内部填充（更透明）
        ctx.fillStyle = `rgba(255, 255, 0, ${alpha * 0.3})`;
        ctx.beginPath();
        ctx.arc(effect.position.x, effect.position.y, effect.radius, 0, Math.PI * 2);
        ctx.fill();
      } else if (effect.type === 'hit_impact') {
        const progress = effect.age / effect.duration;
        const alpha = 1 - progress;

        // 绘制击中粒子
        effect.particles.forEach((particle) => {
          ctx.fillStyle = `rgba(255, 100, 100, ${alpha})`;
          ctx.beginPath();
          ctx.arc(
            effect.position.x + particle.x,
            effect.position.y + particle.y,
            4,
            0,
            Math.PI * 2
          );
          ctx.fill();
        });

        // 绘制中心闪光
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
        ctx.beginPath();
        ctx.arc(effect.position.x, effect.position.y, 12 * (1 - progress * 0.5), 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }

  /**
   * 清空所有弹道
   */
  clearProjectiles() {
    this.projectiles = [];
  }
}
