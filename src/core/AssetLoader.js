import { logger } from '../utils/Logger.js';

/**
 * 资源加载器
 */
export class AssetLoader {
  constructor() {
    this.assets = new Map();
    this.loadProgress = 0;
    this.totalAssets = 0;
  }

  /**
   * 加载图片资源
   */
  loadImage(name, path) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.assets.set(name, img);
        this.loadProgress++;
        logger.debug(`Loaded image: ${name} (${this.loadProgress}/${this.totalAssets})`);
        resolve(img);
      };
      img.onerror = () => {
        logger.error(`Failed to load image: ${name} from ${path}`);
        reject(new Error(`Failed to load image: ${path}`));
      };
      img.src = path;
    });
  }

  /**
   * 加载音频资源
   */
  loadAudio(name, path) {
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.oncanplaythrough = () => {
        this.assets.set(name, audio);
        this.loadProgress++;
        logger.debug(`Loaded audio: ${name} (${this.loadProgress}/${this.totalAssets})`);
        resolve(audio);
      };
      audio.onerror = () => {
        logger.error(`Failed to load audio: ${name} from ${path}`);
        reject(new Error(`Failed to load audio: ${path}`));
      };
      audio.src = path;
    });
  }

  /**
   * 加载所有资源
   */
  async loadAll(manifest) {
    const promises = [];

    // 统计总资源数
    this.totalAssets = manifest.images.length + manifest.audio.length;
    this.loadProgress = 0;

    // 加载图片
    manifest.images.forEach((item) => {
      promises.push(this.loadImage(item.name, item.path).catch((err) => {
        logger.warn(`Image load failed (will use placeholder): ${item.name}`);
        // 创建占位图片而不是失败
        const placeholder = document.createElement('canvas');
        placeholder.width = 64;
        placeholder.height = 64;
        const ctx = placeholder.getContext('2d');
        ctx.fillStyle = '#666';
        ctx.fillRect(0, 0, 64, 64);
        ctx.fillStyle = '#fff';
        ctx.font = '12px Arial';
        ctx.fillText(item.name, 5, 32);
        this.assets.set(item.name, placeholder);
        this.loadProgress++;
      }));
    });

    // 加载音频
    manifest.audio.forEach((item) => {
      promises.push(this.loadAudio(item.name, item.path).catch((err) => {
        logger.warn(`Audio load failed (will be silent): ${item.name}`);
        // 创建空音频对象
        this.assets.set(item.name, { play: () => {} });
        this.loadProgress++;
      }));
    });

    await Promise.all(promises);
    logger.info(`All assets loaded: ${this.loadProgress}/${this.totalAssets}`);
  }

  /**
   * 获取资源
   */
  get(name) {
    const asset = this.assets.get(name);
    if (!asset) {
      logger.warn(`Asset not found: ${name}`);
    }
    return asset;
  }

  /**
   * 获取加载进度(0-1)
   */
  getProgress() {
    if (this.totalAssets === 0) return 1;
    return this.loadProgress / this.totalAssets;
  }
}
