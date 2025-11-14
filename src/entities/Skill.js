/**
 * 技能类(基类)
 *
 * 注意:技能数据存储在Character.skills数组中
 * 这个类主要用于技能相关的辅助方法
 */
export class Skill {
  /**
   * 检查技能是否可用
   */
  static isAvailable(skill) {
    return skill.currentCooldown <= 0;
  }

  /**
   * 获取冷却百分比(0-1)
   */
  static getCooldownPercent(skill) {
    if (skill.cooldown === 0) return 0;
    return skill.currentCooldown / skill.cooldown;
  }

  /**
   * 重置冷却
   */
  static resetCooldown(skill) {
    skill.currentCooldown = 0;
  }
}
