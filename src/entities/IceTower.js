import Tower from './Tower.js';

const LASER_DURATION = 150;

export default class IceTower extends Tower {
  constructor(scene, x, y) {
    super(scene, x, y, 'ice');
    this.slowedGhosts = new Map(); // ghost -> slowEndTime
  }

  tryFire() {
    const target = this.pickTarget();
    if (!target) return;

    this.fireTimer = 0;
    this.drawIceBeam(target);
    target.takeDamage(this.config.damage);
    
    // Apply slow effect
    const slowEndTime = Date.now() + this.config.slowDuration;
    this.slowedGhosts.set(target, slowEndTime);
    if (!target.slowMultiplier) {
      target.slowMultiplier = 1;
    }
    target.slowMultiplier *= this.config.slowFactor;
  }

  update(delta) {
    super.update(delta);
    
    // Remove expired slow effects
    const now = Date.now();
    for (const [ghost, endTime] of this.slowedGhosts) {
      if (now >= endTime) {
        this.slowedGhosts.delete(ghost);
        // Restore speed
        ghost.slowMultiplier /= this.config.slowFactor;
        if (Math.abs(ghost.slowMultiplier - 1) < 0.01) {
          ghost.slowMultiplier = 1;
        }
      }
    }

    if (this.laserAge > LASER_DURATION) {
      this.laser.clear();
    }
  }

  drawIceBeam(target) {
    this.laserAge = 0;
    this.laser.clear();

    const barrelX = this.sprite.x + 14;
    const barrelY = this.sprite.y - 4;
    const tx = target.sprite.x;
    const ty = target.sprite.y;

    // Outer glow (cyan)
    this.laser.lineStyle(5, 0x66ddff, 0.3);
    this.laser.beginPath();
    this.laser.moveTo(barrelX, barrelY);
    this.laser.lineTo(tx, ty);
    this.laser.strokePath();

    // Core beam
    this.laser.lineStyle(2, 0x22aaff, 1);
    this.laser.beginPath();
    this.laser.moveTo(barrelX, barrelY);
    this.laser.lineTo(tx, ty);
    this.laser.strokePath();

    // Bright centre
    this.laser.lineStyle(1, 0xaaddff, 0.8);
    this.laser.beginPath();
    this.laser.moveTo(barrelX, barrelY);
    this.laser.lineTo(tx, ty);
    this.laser.strokePath();
  }
}
