import { logger } from '../utils/Logger.js';

/**
 * 配置文件加载器
 */
export class ConfigLoader {
  constructor() {
    this.configs = new Map();
  }

  /**
   * 加载JSON配置文件
   */
  async loadConfig(name, path) {
    try {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      this.configs.set(name, data);
      logger.debug(`Loaded config: ${name}`);
      return data;
    } catch (error) {
      logger.error(`Failed to load config: ${name} from ${path}`, error);
      throw error;
    }
  }

  /**
   * 加载所有配置文件
   */
  async loadAll() {
    const configFiles = [
      { name: 'characters', path: '/assets/config/characters.json' },
      { name: 'skills', path: '/assets/config/skills.json' },
      { name: 'platforms', path: '/assets/config/platforms.json' },
      { name: 'physics', path: '/assets/config/physics.json' },
      { name: 'input', path: '/assets/config/input.json' },
      { name: 'assets', path: '/assets/config/assets.json' },
    ];

    const promises = configFiles.map((file) => this.loadConfig(file.name, file.path));

    await Promise.all(promises);
    logger.info('All configs loaded');
  }

  /**
   * 获取配置
   */
  get(name) {
    const config = this.configs.get(name);
    if (!config) {
      logger.warn(`Config not found: ${name}`);
    }
    return config;
  }
}
