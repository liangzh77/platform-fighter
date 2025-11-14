import { logger } from '../utils/Logger.js';

/**
 * 输入管理器
 */
export class InputManager {
  constructor() {
    this.keysPressed = new Set();
    this.keysJustPressed = new Set();
    this.keysJustReleased = new Set();
    this.keyBindings = null;

    // 绑定事件监听器
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);

    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);

    logger.debug('InputManager initialized');
  }

  /**
   * 加载按键绑定配置
   */
  loadBindings(inputConfig) {
    this.keyBindings = inputConfig;
    logger.debug('Key bindings loaded');
  }

  /**
   * 键盘按下事件
   */
  handleKeyDown(event) {
    // 只在首次按下时添加到justPressed
    if (!this.keysPressed.has(event.code)) {
      this.keysJustPressed.add(event.code);
    }
    this.keysPressed.add(event.code);

    // 阻止某些默认行为
    if (
      event.code.startsWith('Arrow') ||
      event.code === 'Space' ||
      event.code.startsWith('Key') ||
      event.code.startsWith('F')
    ) {
      event.preventDefault();
    }
  }

  /**
   * 键盘松开事件
   */
  handleKeyUp(event) {
    this.keysPressed.delete(event.code);
    this.keysJustReleased.add(event.code);
  }

  /**
   * 每帧结束时清理just pressed/released状态
   */
  update() {
    this.keysJustPressed.clear();
    this.keysJustReleased.clear();
  }

  /**
   * 检查按键是否按下
   */
  isKeyPressed(code) {
    return this.keysPressed.has(code);
  }

  /**
   * 检查玩家动作是否激活
   */
  isActionPressed(player, action) {
    if (!this.keyBindings) return false;

    const playerBindings = this.keyBindings[player];
    if (!playerBindings) return false;

    const keyCode = playerBindings[action];
    if (!keyCode) return false;

    return this.isKeyPressed(keyCode);
  }

  /**
   * 检查玩家动作是否刚被触发(单次按下)
   */
  isActionJustPressed(player, action) {
    if (!this.keyBindings) return false;

    const playerBindings = this.keyBindings[player];
    if (!playerBindings) return false;

    const keyCode = playerBindings[action];
    if (!keyCode) return false;

    return this.keysJustPressed.has(keyCode);
  }

  /**
   * 清理
   */
  destroy() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    this.keysPressed.clear();
  }
}
