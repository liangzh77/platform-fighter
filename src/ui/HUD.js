/**
 * HUD - 抬头显示
 */
export class HUD {
  constructor(player1, player2) {
    this.player1 = player1;
    this.player2 = player2;
  }

  /**
   * 渲染HUD
   */
  render(ctx) {
    this.renderPlayerInfo(ctx, this.player1, 20, 20, 'Player 1');
    this.renderPlayerInfo(ctx, this.player2, 1024 - 220, 20, 'Player 2');
  }

  /**
   * 渲染玩家信息
   */
  renderPlayerInfo(ctx, player, x, y, label) {
    // 背景
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(x, y, 200, 120);

    // 玩家标签
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(label, x + 10, y + 25);

    // 生命条
    const healthPercent = player.health / player.maxHealth;
    ctx.fillStyle = '#333';
    ctx.fillRect(x + 10, y + 35, 180, 20);

    const healthColor = healthPercent > 0.5 ? '#4ade80' : healthPercent > 0.25 ? '#facc15' : '#ef4444';
    ctx.fillStyle = healthColor;
    ctx.fillRect(x + 10, y + 35, 180 * healthPercent, 20);

    ctx.fillStyle = '#fff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${player.health} / ${player.maxHealth}`, x + 100, y + 50);

    // 复活次数
    ctx.fillStyle = '#fff';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Respawns: ${Math.max(0, player.respawns)}`, x + 10, y + 75);

    // 无敌状态
    if (player.isInvincible) {
      ctx.fillStyle = '#60a5fa';
      ctx.fillText(`Invincible: ${player.invincibleTimer.toFixed(1)}s`, x + 10, y + 95);
    }

    // 技能冷却
    ctx.fillStyle = '#aaa';
    ctx.font = '12px Arial';
    ctx.fillText('Skills:', x + 10, y + 115);

    player.skills.forEach((skill, index) => {
      const skillX = x + 60 + index * 35;
      const skillY = y + 102;

      // 技能背景（根据技能类型设置不同颜色）
      const bgColors = {
        melee: '#8b5cf6',
        projectile: '#f59e0b',
        teleport: '#06b6d4',
        ultimate: '#ef4444',
      };
      ctx.fillStyle = bgColors[skill.type] || '#333';
      ctx.fillRect(skillX, skillY, 30, 30);

      // 冷却遮罩
      if (skill.currentCooldown > 0) {
        const cooldownPercent = skill.currentCooldown / skill.cooldown;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(skillX, skillY, 30, 30 * cooldownPercent);
      }

      // 技能图标（使用文字缩写）
      const iconText = {
        melee: '近',
        projectile: '远',
        teleport: '换',
        ultimate: '大',
      };
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(iconText[skill.type] || '?', skillX + 15, skillY + 20);

      // 冷却时间
      if (skill.currentCooldown > 0) {
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 10px Arial';
        ctx.fillText(skill.currentCooldown.toFixed(1), skillX + 15, skillY + 28);
      }
    });
  }
}
