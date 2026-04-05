import { TOWER_RANGE, TOWER_FIRE_RATE, TOWER_DAMAGE } from '../config/constants.js';

const LASER_DURATION = 150; // ms laser beam stays visible

export default class Tower {
  constructor(scene, x, y) {
    this.scene     = scene;
    this.x         = x;
    this.y         = y;
    this.fireTimer = 0;
    this.laserAge  = LASER_DURATION + 1; // start with no laser showing

    this.sprite = scene.add.image(x, y, 'tower')
      .setDepth(4)
      .setOrigin(0.5, 0.75); // anchor near base

    this.laser = scene.add.graphics().setDepth(8);
  }

  update(delta) {
    this.fireTimer += delta;
    this.laserAge  += delta;

    if (this.laserAge > LASER_DURATION) {
      this.laser.clear();
    }

    if (this.fireTimer >= TOWER_FIRE_RATE) {
      this.tryFire();
    }
  }

  tryFire() {
    const target = this.pickTarget();
    if (!target) return;

    this.fireTimer = 0;
    this.drawLaser(target);
    target.takeDamage(TOWER_DAMAGE);
  }

  pickTarget() {
    // Prefer the ghost that is furthest along (nearest house), regardless of direction.
    // Prioritise walking ghosts over retreating so we stop fresh threats first.
    const ghosts = this.scene.ghosts.filter(g => g.state !== 'dead');
    if (ghosts.length === 0) return null;

    let target   = null;
    let bestScore = -Infinity;

    for (const ghost of ghosts) {
      const dist = Phaser.Math.Distance.Between(this.x, this.y, ghost.sprite.x, ghost.sprite.y);
      if (dist > TOWER_RANGE) continue;

      // Score: walking ghosts score higher; further along = higher x
      const dirBonus = ghost.state === 'walking' ? 1000 : 0;
      const score    = ghost.sprite.x + dirBonus;
      if (score > bestScore) {
        bestScore = score;
        target    = ghost;
      }
    }

    return target;
  }

  drawLaser(target) {
    this.laserAge = 0;
    this.laser.clear();

    const barrelX = this.sprite.x + 14;
    const barrelY = this.sprite.y - 4;
    const tx = target.sprite.x;
    const ty = target.sprite.y;

    // Outer glow
    this.laser.lineStyle(5, 0xff6666, 0.3);
    this.laser.beginPath();
    this.laser.moveTo(barrelX, barrelY);
    this.laser.lineTo(tx, ty);
    this.laser.strokePath();

    // Core beam
    this.laser.lineStyle(2, 0xff2222, 1);
    this.laser.beginPath();
    this.laser.moveTo(barrelX, barrelY);
    this.laser.lineTo(tx, ty);
    this.laser.strokePath();

    // Bright centre
    this.laser.lineStyle(1, 0xffaaaa, 0.8);
    this.laser.beginPath();
    this.laser.moveTo(barrelX, barrelY);
    this.laser.lineTo(tx, ty);
    this.laser.strokePath();
  }

  destroy() {
    this.sprite.destroy();
    this.laser.destroy();
  }
}
