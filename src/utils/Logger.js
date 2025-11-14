/**
 * 日志级别
 */
export const LogLevel = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

/**
 * 日志系统
 */
export class Logger {
  constructor(context = 'Game') {
    this.context = context;
    this.minLevel = LogLevel.INFO; // 默认只显示INFO及以上级别
  }

  /**
   * 设置最小日志级别
   */
  setLevel(level) {
    this.minLevel = level;
  }

  /**
   * DEBUG级别日志
   */
  debug(message, ...args) {
    if (this.minLevel <= LogLevel.DEBUG) {
      console.debug(`[DEBUG] [${this.context}]`, message, ...args);
    }
  }

  /**
   * INFO级别日志
   */
  info(message, ...args) {
    if (this.minLevel <= LogLevel.INFO) {
      console.info(`[INFO] [${this.context}]`, message, ...args);
    }
  }

  /**
   * WARN级别日志
   */
  warn(message, ...args) {
    if (this.minLevel <= LogLevel.WARN) {
      console.warn(`[WARN] [${this.context}]`, message, ...args);
    }
  }

  /**
   * ERROR级别日志
   */
  error(message, ...args) {
    if (this.minLevel <= LogLevel.ERROR) {
      console.error(`[ERROR] [${this.context}]`, message, ...args);
    }
  }
}

/**
 * 全局日志实例
 */
export const logger = new Logger('Global');
