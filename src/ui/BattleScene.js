import { Character } from '../entities/Character.js';
import { Platform } from '../entities/Platform.js';
import { PhysicsEngine } from '../systems/PhysicsEngine.js';
import { SkillSystem } from '../systems/SkillSystem.js';
import { HUD } from './HUD.js';
import { logger } from '../utils/Logger.js';

/**
 * 对战场景
 */
export class BattleScene {
  constructor(game) {
    this.game = game;
    this.platforms = [];
    this.player1 = null;
    this.player2 = null;
    this.winner = null;

    // 系统
    this.physicsEngine = null;
    this.skillSystem = null;
    this.hud = null;

    // 击杀系统
    this.killTracker = {
      firstBloodTaken: false,
      player1Kills: 0,
      player2Kills: 0,
      player1KillStreak: 0,
      player2KillStreak: 0,
      announcements: [], // 存储公告文字
    };

    this.initialized = false;
  }

  /**
   * 进入场景
   */
  onEnter(data) {
    logger.info('Entering BattleScene', data);

    // 加载配置
    const charactersConfig = this.game.getConfig('characters');
    const skillsConfig = this.game.getConfig('skills');
    const platformsConfig = this.game.getConfig('platforms');
    const physicsConfig = this.game.getConfig('physics');

    // 创建物理引擎和技能系统
    this.physicsEngine = new PhysicsEngine(physicsConfig);
    this.skillSystem = new SkillSystem(skillsConfig);

    // 创建平台
    this.platforms = platformsConfig.platforms.map((platConf) => new Platform(platConf));

    // 创建玩家角色
    const char1Type = data.player1Character || 'characterA';
    const char2Type = data.player2Character || 'characterB';

    this.player1 = new Character('player1', char1Type, charactersConfig[char1Type], skillsConfig);
    this.player2 = new Character('player2', char2Type, charactersConfig[char2Type], skillsConfig);

    // 初始位置(中间平台) - 使用hitbox高度确保正确站立
    const centerPlatform = this.platforms.find((p) => p.id === 'center_bottom');
    if (centerPlatform) {
      const char1Hitbox = charactersConfig[char1Type].hitbox;
      const char2Hitbox = charactersConfig[char2Type].hitbox;

      // 角色位置 = 平台顶部 - hitbox高度 + hitbox.offsetY
      this.player1.position.x = centerPlatform.position.x + 50;
      this.player1.position.y = centerPlatform.position.y - char1Hitbox.height - char1Hitbox.offsetY;
      this.player1.isOnGround = true; // 明确标记在地面上
      this.player1.stabilizationTimer = 0.1; // 给予短暂稳定时间防止立即下落

      this.player2.position.x = centerPlatform.position.x + centerPlatform.width - 70;
      this.player2.position.y = centerPlatform.position.y - char2Hitbox.height - char2Hitbox.offsetY;
      this.player2.isOnGround = true; // 明确标记在地面上
      this.player2.stabilizationTimer = 0.1; // 给予短暂稳定时间防止立即下落
    }

    // 创建HUD
    this.hud = new HUD(this.player1, this.player2);

    this.winner = null;
    this.initialized = true;
  }

  /**
   * 退出场景
   */
  onExit() {
    logger.info('Exiting BattleScene');
    this.initialized = false;
  }

  /**
   * 更新场景
   */
  update(deltaTime) {
    if (!this.initialized) return;

    // 如果有胜利者,检测返回开始界面
    if (this.winner) {
      const input = this.game.inputManager;
      if (input.isKeyPressed('Space')) {
        this.game.stateManager.changeState('start');
      }
      return;
    }

    this.handleInput();
    this.updateCharacters(deltaTime);
    this.updatePhysics(deltaTime);
    this.updateAnnouncements(deltaTime);
    this.checkGameOver();
  }

  /**
   * 处理输入
   */
  handleInput() {
    const input = this.game.inputManager;

    // 玩家1控制
    if (!this.player1.isDead) {
      let moveDir = 0;
      if (input.isActionPressed('player1', 'moveLeft')) moveDir -= 1;
      if (input.isActionPressed('player1', 'moveRight')) moveDir += 1;
      this.player1.move(moveDir);

      // 跳跃需要按键触发(不能持续按住)
      if (input.isActionJustPressed('player1', 'jump')) {
        this.player1.jump();
      }

      // 技能
      if (input.isActionPressed('player1', 'skill1')) {
        this.skillSystem.useSkill(this.player1, 0, this.player2);
      }
      if (input.isActionPressed('player1', 'skill2')) {
        this.skillSystem.useSkill(this.player1, 1, this.player2);
      }
      if (input.isActionPressed('player1', 'skill3')) {
        this.skillSystem.useSkill(this.player1, 2, this.player2);
      }
      if (input.isActionPressed('player1', 'skill4')) {
        this.skillSystem.useSkill(this.player1, 3, this.player2);
      }
    }

    // 玩家2控制
    if (!this.player2.isDead) {
      let moveDir = 0;
      if (input.isActionPressed('player2', 'moveLeft')) moveDir -= 1;
      if (input.isActionPressed('player2', 'moveRight')) moveDir += 1;
      this.player2.move(moveDir);

      // 跳跃需要按键触发(不能持续按住)
      if (input.isActionJustPressed('player2', 'jump')) {
        this.player2.jump();
      }

      // 技能
      if (input.isActionPressed('player2', 'skill1')) {
        this.skillSystem.useSkill(this.player2, 0, this.player1);
      }
      if (input.isActionPressed('player2', 'skill2')) {
        this.skillSystem.useSkill(this.player2, 1, this.player1);
      }
      if (input.isActionPressed('player2', 'skill3')) {
        this.skillSystem.useSkill(this.player2, 2, this.player1);
      }
      if (input.isActionPressed('player2', 'skill4')) {
        this.skillSystem.useSkill(this.player2, 3, this.player1);
      }
    }
  }

  /**
   * 更新角色
   */
  updateCharacters(deltaTime) {
    this.player1.update(deltaTime);
    this.player2.update(deltaTime);

    // 更新技能冷却
    this.skillSystem.updateCooldowns(this.player1, deltaTime);
    this.skillSystem.updateCooldowns(this.player2, deltaTime);

    // 更新弹道
    this.skillSystem.updateProjectiles(deltaTime, [this.player1, this.player2]);

    // 更新视觉特效
    this.skillSystem.updateVisualEffects(deltaTime);

    // 应用无敌模式(调试)
    if (this.game.debug.godMode) {
      this.player1.isInvincible = true;
      this.player2.isInvincible = true;
    }
  }

  /**
   * 更新物理
   */
  updatePhysics(deltaTime) {
    [this.player1, this.player2].forEach((char) => {
      if (char.isDead) return;

      // 标记为不在地面(稍后碰撞检测会更新)
      if (char.stabilizationTimer <= 0) {
        char.isOnGround = false;
      }

      // 应用重力
      if (char.stabilizationTimer <= 0) {
        this.physicsEngine.applyGravity(char, deltaTime);
      }

      // 应用摩擦力
      this.physicsEngine.applyFriction(char, deltaTime);

      // 更新位置
      this.physicsEngine.updatePosition(char, deltaTime);

      // 平台碰撞
      this.platforms.forEach((platform) => {
        this.physicsEngine.checkPlatformCollision(char, platform);
      });

      // 检查离开平台
      if (char.isOnGround && char.stabilizationTimer <= 0) {
        if (this.physicsEngine.checkLeftPlatform(char, this.platforms)) {
          char.isOnGround = false;
        }
      }

      // 检查出界
      if (this.physicsEngine.isOutOfBounds(char)) {
        // 记录是谁死亡，更新击杀数（出界算对手击杀）
        if (!char.isDead) {
          const killer = char === this.player1 ? this.player2 : this.player1;
          char.die(killer);
          if (char.lastAttacker) {
            this.recordKill(char.lastAttacker);
          }
        }
      }

      // 处理死亡和复活
      if (char.isDead) {
        // 如果角色刚死亡且有攻击者，记录击杀
        if (char.lastAttacker && !char.killRecorded) {
          this.recordKill(char.lastAttacker);
          char.killRecorded = true; // 标记已记录，避免重复
        }

        const centerPlatform = this.platforms.find((p) => p.id === 'center_bottom');
        if (centerPlatform) {
          const x = centerPlatform.position.x + centerPlatform.width / 2;
          const y = centerPlatform.position.y - char.config.hitbox.height - char.config.hitbox.offsetY;
          if (char.respawn(x, y)) {
            char.isOnGround = true; // 复活后确保在地面上
            char.stabilizationTimer = 0.1; // 给予短暂稳定时间防止立即下落
            char.lastAttacker = null; // 清除攻击者记录
            char.killRecorded = false; // 重置击杀记录标记
          }
        }
      }
    });
  }

  /**
   * 检查游戏结束
   */
  checkGameOver() {
    if (this.player1.respawns < 0 && this.player1.isDead) {
      this.winner = 'player2';
      logger.info('Player 2 wins!');
    } else if (this.player2.respawns < 0 && this.player2.isDead) {
      this.winner = 'player1';
      logger.info('Player 1 wins!');
    }
  }

  /**
   * 记录击杀
   */
  recordKill(killer) {
    const killerKey = killer === this.player1 ? 'player1' : 'player2';
    const otherKey = killer === this.player1 ? 'player2' : 'player1';

    // 增加击杀数和连杀数
    this.killTracker[`${killerKey}Kills`]++;
    this.killTracker[`${killerKey}KillStreak`]++;

    // 重置对手的连杀数
    this.killTracker[`${otherKey}KillStreak`] = 0;

    // 检查是否是First Blood
    if (!this.killTracker.firstBloodTaken) {
      this.killTracker.firstBloodTaken = true;
      this.addAnnouncement('FIRST BLOOD!');
      logger.info('First Blood!');
    }

    // 检查连杀
    const killStreak = this.killTracker[`${killerKey}KillStreak`];
    if (killStreak === 3) {
      this.addAnnouncement('LEGENDARY!');
      logger.info(`${killerKey} is LEGENDARY!`);
    }
  }

  /**
   * 添加公告
   */
  addAnnouncement(text) {
    this.killTracker.announcements.push({
      text: text,
      age: 0,
      duration: 2.5, // 2.5秒后淡出
    });
  }

  /**
   * 更新公告
   */
  updateAnnouncements(deltaTime) {
    for (let i = this.killTracker.announcements.length - 1; i >= 0; i--) {
      this.killTracker.announcements[i].age += deltaTime;
      if (this.killTracker.announcements[i].age >= this.killTracker.announcements[i].duration) {
        this.killTracker.announcements.splice(i, 1);
      }
    }
  }

  /**
   * 重置技能冷却(调试)
   */
  resetCooldowns() {
    this.player1.skills.forEach((skill) => (skill.currentCooldown = 0));
    this.player2.skills.forEach((skill) => (skill.currentCooldown = 0));
    logger.info('All cooldowns reset');
  }

  /**
   * 渲染场景
   */
  render(ctx) {
    if (!this.initialized) return;

    // 背景
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, 1024, 768);

    // 平台
    this.platforms.forEach((platform) => platform.render(ctx, this.game.debug));

    // 角色
    this.player1.render(ctx, this.game.debug);
    this.player2.render(ctx, this.game.debug);

    // 视觉特效（在角色之后，弹道之前渲染）
    this.skillSystem.renderVisualEffects(ctx);

    // 弹道
    this.skillSystem.renderProjectiles(ctx);

    // HUD
    if (this.hud) {
      this.hud.render(ctx);
    }

    // 技能键位提示（底部中央）
    this.renderKeyBindingsHint(ctx);

    // 渲染公告（First Blood / Legendary）
    this.renderAnnouncements(ctx);

    // 胜利信息
    if (this.winner) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, 1024, 768);

      const winnerColor = this.winner === 'player1' ? '#ff6b6b' : '#4ecdc4';
      ctx.fillStyle = winnerColor;
      ctx.font = 'bold 64px Arial';
      ctx.textAlign = 'center';
      const winnerText = this.winner === 'player1' ? 'Player 1 Wins!' : 'Player 2 Wins!';
      ctx.fillText(winnerText, 512, 350);

      ctx.fillStyle = '#fff';
      ctx.font = '24px Arial';
      ctx.fillText('Press SPACE to return to start', 512, 420);
      ctx.fillText('Press F5 to reload game', 512, 460);
    }
  }

  /**
   * 渲染键位提示
   */
  renderKeyBindingsHint(ctx) {
    // 半透明背景
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 728, 1024, 40);

    // 玩家1提示
    ctx.fillStyle = '#ff6b6b';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('P1: Q=近战 E=远程 R=换位 F=大招', 20, 750);

    // 玩家2提示
    ctx.fillStyle = '#4ecdc4';
    ctx.textAlign = 'right';
    ctx.fillText('P2: U=近战 I=远程 O=换位 P=大招', 1004, 750);

    // 中央提示
    ctx.fillStyle = '#aaa';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('F12=调试UI | F1=无敌 | F2=重置CD', 512, 750);
  }

  /**
   * 渲染公告（First Blood / Legendary）
   */
  renderAnnouncements(ctx) {
    this.killTracker.announcements.forEach((announcement) => {
      const progress = announcement.age / announcement.duration;
      let alpha = 1;

      // 前80%时间完全不透明，最后20%时间淡出
      if (progress > 0.8) {
        alpha = 1 - (progress - 0.8) / 0.2;
      }

      // 渲染文字阴影
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 20;
      ctx.shadowOffsetX = 5;
      ctx.shadowOffsetY = 5;

      // 渲染公告文字
      ctx.fillStyle = `rgba(255, 50, 50, ${alpha})`;
      ctx.font = 'bold 80px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(announcement.text, 512, 300);

      // 重置阴影
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    });
  }
}
