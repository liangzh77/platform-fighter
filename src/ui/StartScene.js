import { logger } from '../utils/Logger.js';

/**
 * 开始场景 - 显示按键说明和角色选择
 */
export class StartScene {
  constructor(game) {
    this.game = game;
    this.player1Choice = 'characterA'; // 默认选择A
    this.player2Choice = 'characterB'; // 默认选择B
    this.ready = false;
  }

  /**
   * 进入场景
   */
  onEnter() {
    logger.info('Entering StartScene');
    this.player1Choice = 'characterA';
    this.player2Choice = 'characterB';
    this.ready = false;
  }

  /**
   * 退出场景
   */
  onExit() {
    logger.info('Exiting StartScene');
  }

  /**
   * 更新场景
   */
  update(deltaTime) {
    const input = this.game.inputManager;

    // 玩家1选择角色 (Q=A, E=B)
    if (input.isActionJustPressed('player1', 'skill1')) {
      this.player1Choice = 'characterA';
    }
    if (input.isActionJustPressed('player1', 'skill2')) {
      this.player1Choice = 'characterB';
    }

    // 玩家2选择角色 (U=A, I=B)
    if (input.isActionJustPressed('player2', 'skill1')) {
      this.player2Choice = 'characterA';
    }
    if (input.isActionJustPressed('player2', 'skill2')) {
      this.player2Choice = 'characterB';
    }

    // 空格键或Enter开始游戏
    if (input.isKeyPressed('Space') || input.isKeyPressed('Enter')) {
      this.ready = true;
      this.game.stateManager.changeState('battle', {
        player1Character: this.player1Choice,
        player2Character: this.player2Choice,
      });
    }
  }

  /**
   * 渲染场景
   */
  render(ctx) {
    // 背景
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, 1024, 768);

    // 标题
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('重力平台对战游戏', 512, 100);

    // 副标题
    ctx.font = '24px Arial';
    ctx.fillStyle = '#aaa';
    ctx.fillText('Gravity Platform Fighter', 512, 140);

    // 分隔线
    ctx.strokeStyle = '#444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(200, 180);
    ctx.lineTo(824, 180);
    ctx.stroke();

    // 玩家1控制说明
    this.renderPlayerControls(ctx, 150, 220, 'Player 1', 'player1', this.player1Choice);

    // 玩家2控制说明
    this.renderPlayerControls(ctx, 550, 220, 'Player 2', 'player2', this.player2Choice);

    // 中间分隔线
    ctx.strokeStyle = '#444';
    ctx.beginPath();
    ctx.moveTo(512, 200);
    ctx.lineTo(512, 600);
    ctx.stroke();

    // 底部提示
    ctx.fillStyle = '#4ade80';
    ctx.font = 'bold 28px Arial';
    ctx.fillText('按 SPACE 或 ENTER 开始游戏', 512, 680);

    // 闪烁效果
    if (Math.floor(Date.now() / 500) % 2 === 0) {
      ctx.fillStyle = '#facc15';
      ctx.font = '18px Arial';
      ctx.fillText('↑ 选择角色后按此开始 ↑', 512, 720);
    }
  }

  /**
   * 渲染玩家控制说明
   */
  renderPlayerControls(ctx, x, y, label, player, choice) {
    const color = player === 'player1' ? '#ff6b6b' : '#4ecdc4';

    // 玩家标签
    ctx.fillStyle = color;
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(label, x + 150, y);

    // 角色选择
    ctx.fillStyle = '#fff';
    ctx.font = '18px Arial';
    ctx.fillText('选择角色:', x + 150, y + 40);

    const char1Config = this.game.getConfig('characters').characterA;
    const char2Config = this.game.getConfig('characters').characterB;

    // 角色A按钮
    const char1Color = choice === 'characterA' ? '#4ade80' : '#666';
    ctx.fillStyle = char1Color;
    ctx.fillRect(x + 30, y + 60, 120, 80);
    ctx.fillStyle = '#000';
    ctx.font = 'bold 32px Arial';
    ctx.fillText('A', x + 90, y + 110);

    // 角色B按钮
    const char2Color = choice === 'characterB' ? '#4ade80' : '#666';
    ctx.fillStyle = char2Color;
    ctx.fillRect(x + 180, y + 60, 120, 80);
    ctx.fillStyle = '#000';
    ctx.font = 'bold 32px Arial';
    ctx.fillText('B', x + 240, y + 110);

    // 选择提示
    ctx.fillStyle = '#aaa';
    ctx.font = '14px Arial';
    if (player === 'player1') {
      ctx.fillText('按 Q 选 A, 按 E 选 B', x + 150, y + 160);
    } else {
      ctx.fillText('按 U 选 A, 按 I 选 B', x + 150, y + 160);
    }

    // 控制说明
    ctx.fillStyle = '#fff';
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';

    let controlY = y + 200;
    ctx.fillText('游戏控制:', x + 30, controlY);
    controlY += 30;

    if (player === 'player1') {
      ctx.font = '14px Arial';
      ctx.fillText('移动: A (左) / D (右)', x + 30, controlY);
      controlY += 25;
      ctx.fillText('跳跃: W', x + 30, controlY);
      controlY += 25;
      ctx.fillText('技能1: Q (近战 10伤害)', x + 30, controlY);
      controlY += 25;
      ctx.fillText('技能2: E (远程 30伤害)', x + 30, controlY);
      controlY += 25;
      ctx.fillText('技能3: R (位置交换)', x + 30, controlY);
      controlY += 25;
      ctx.fillText('技能4: F (大招)', x + 30, controlY);
    } else {
      ctx.font = '14px Arial';
      ctx.fillText('移动: ← (左) / → (右)', x + 30, controlY);
      controlY += 25;
      ctx.fillText('跳跃: ↑', x + 30, controlY);
      controlY += 25;
      ctx.fillText('技能1: U (近战 10伤害)', x + 30, controlY);
      controlY += 25;
      ctx.fillText('技能2: I (远程 30伤害)', x + 30, controlY);
      controlY += 25;
      ctx.fillText('技能3: O (位置交换)', x + 30, controlY);
      controlY += 25;
      ctx.fillText('技能4: P (大招)', x + 30, controlY);
    }
  }
}
