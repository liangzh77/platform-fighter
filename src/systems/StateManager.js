import { logger } from '../utils/Logger.js';

/**
 * 状态管理器(场景管理)
 */
export class StateManager {
  constructor(game) {
    this.game = game;
    this.states = new Map();
    this.currentState = null;
    this.nextState = null;
  }

  /**
   * 注册状态/场景
   */
  registerState(name, state) {
    this.states.set(name, state);
    logger.debug(`State registered: ${name}`);
  }

  /**
   * 切换状态
   */
  changeState(name, data = {}) {
    const newState = this.states.get(name);
    if (!newState) {
      logger.error(`State not found: ${name}`);
      return;
    }

    // 退出当前状态
    if (this.currentState && this.currentState.onExit) {
      this.currentState.onExit();
    }

    // 进入新状态
    this.currentState = newState;
    if (this.currentState.onEnter) {
      this.currentState.onEnter(data);
    }

    logger.info(`State changed to: ${name}`);
  }

  /**
   * 获取当前状态
   */
  getCurrentState() {
    return this.currentState;
  }

  /**
   * 更新当前状态
   */
  update(deltaTime) {
    if (this.currentState && this.currentState.update) {
      this.currentState.update(deltaTime);
    }
  }

  /**
   * 渲染当前状态
   */
  render(ctx) {
    if (this.currentState && this.currentState.render) {
      this.currentState.render(ctx);
    }
  }
}
