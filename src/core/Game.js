import { Time } from './Time.js';
import { AssetLoader } from './AssetLoader.js';
import { ConfigLoader } from './ConfigLoader.js';
import { InputManager } from '../systems/InputManager.js';
import { Renderer } from '../systems/Renderer.js';
import { StateManager } from '../systems/StateManager.js';
import { Debug } from '../utils/Debug.js';
import { logger } from '../utils/Logger.js';

/**
 * 主游戏类
 */
export class Game {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      throw new Error(`Canvas element not found: ${canvasId}`);
    }

    this.ctx = this.canvas.getContext('2d');
    this.running = false;
    this.animationFrameId = null;

    // 核心系统
    this.time = new Time();
    this.assetLoader = new AssetLoader();
    this.configLoader = new ConfigLoader();
    this.inputManager = new InputManager();
    this.renderer = new Renderer(this.canvas, this.ctx);
    this.stateManager = new StateManager(this);
    this.debug = new Debug(this);

    // 当前场景引用
    this.currentScene = null;

    // 暴露到全局(开发模式)
    if (typeof window !== 'undefined') {
      window.game = this;
    }

    logger.info('Game initialized');
  }

  /**
   * 初始化游戏
   */
  async init() {
    try {
      logger.info('Loading configurations...');
      await this.configLoader.loadAll();

      logger.info('Loading assets...');
      const assetsConfig = this.configLoader.get('assets');
      await this.assetLoader.loadAll(assetsConfig);

      logger.info('Game initialization complete');
    } catch (error) {
      logger.error('Game initialization failed:', error);
      throw error;
    }
  }

  /**
   * 开始游戏循环
   */
  start() {
    if (this.running) return;

    this.running = true;
    this.time.reset();
    this.gameLoop(performance.now());
    logger.info('Game started');
  }

  /**
   * 停止游戏循环
   */
  stop() {
    if (!this.running) return;

    this.running = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    logger.info('Game stopped');
  }

  /**
   * 游戏主循环
   */
  gameLoop(currentTime) {
    if (!this.running) return;

    // 更新时间
    this.time.update(currentTime);

    // 更新调试信息
    this.debug.update();

    // 更新当前场景
    this.currentScene = this.stateManager.getCurrentState();
    if (this.currentScene) {
      this.currentScene.update(this.time.deltaTime);
    }

    // 渲染
    this.renderer.clear();
    if (this.currentScene) {
      this.currentScene.render(this.ctx);
    }

    // 渲染调试信息
    this.debug.render(this.ctx);

    // 清理输入状态(每帧结束时)
    this.inputManager.update();

    // 下一帧
    this.animationFrameId = requestAnimationFrame((time) => this.gameLoop(time));
  }

  /**
   * 获取配置
   */
  getConfig(name) {
    return this.configLoader.get(name);
  }

  /**
   * 获取资源
   */
  getAsset(name) {
    return this.assetLoader.get(name);
  }
}
