import { Game } from './core/Game.js';
import { StartScene } from './ui/StartScene.js';
import { BattleScene } from './ui/BattleScene.js';
import { logger, LogLevel } from './utils/Logger.js';

/**
 * 游戏入口
 */
async function main() {
  try {
    // 设置日志级别(开发模式)
    logger.setLevel(LogLevel.INFO);
    logger.info('=== Game Starting ===');

    // 创建游戏实例
    const game = new Game('gameCanvas');

    // 初始化(加载配置和资源)
    await game.init();

    // 创建并注册场景
    const startScene = new StartScene(game);
    const battleScene = new BattleScene(game);
    game.stateManager.registerState('start', startScene);
    game.stateManager.registerState('battle', battleScene);

    // 进入开始场景
    game.stateManager.changeState('start');

    // 加载输入配置
    const inputConfig = game.getConfig('input');
    game.inputManager.loadBindings(inputConfig);

    // 绑定调试快捷键
    window.addEventListener('keydown', (e) => {
      const debugKeys = inputConfig.debug;

      if (e.code === debugKeys.toggleDebugUI) {
        game.debug.toggleDebugUI();
        e.preventDefault();
      } else if (e.code === debugKeys.godMode) {
        game.debug.toggleGodMode();
        e.preventDefault();
      } else if (e.code === debugKeys.resetCooldowns) {
        if (battleScene && battleScene.resetCooldowns) {
          battleScene.resetCooldowns();
        }
        e.preventDefault();
      } else if (e.code === debugKeys.showHitboxes) {
        game.debug.toggleHitboxes();
        e.preventDefault();
      } else if (e.code === debugKeys.showSkillRanges) {
        game.debug.toggleSkillRanges();
        e.preventDefault();
      }
    });

    // 启动游戏循环
    game.start();

    logger.info('=== Game Running ===');
    logger.info('Player 1: WASD移动, W跳跃, Q/E/R/F技能');
    logger.info('Player 2: 方向键移动, ↑跳跃, U/I/O/P技能');
    logger.info('调试: F12=UI, F1=无敌, F2=重置CD, F3=碰撞盒, F4=技能范围');
  } catch (error) {
    logger.error('Game failed to start:', error);
    document.body.innerHTML = `
      <div style="color: white; padding: 50px; text-align: center;">
        <h1>游戏加载失败</h1>
        <p>${error.message}</p>
        <p>请检查控制台获取详细错误信息</p>
      </div>
    `;
  }
}

// 启动游戏
main();
