import Tower from './Tower.js';

export default class CannonTower extends Tower {
  constructor(scene, x, y) {
    super(scene, x, y, 'cannon');
  }

  tryFire() {
    const target = this.pickTarget();
    if (!target) return;

    this.fireTimer = 0;
    this.drawCannonBlast(target);
    
    // Area damage - hit all ghosts within areaRadius
    const ghosts = this.scene.ghosts.filter(g => g.state !== 'dead');
    for (const ghost of ghosts) {
      const dist = Phaser.Math.Distance.Between(target.sprite.x, target.sprite.y, 
                                                 ghost.sprite.x, ghost.sprite.y);
      if (dist <= this.config.areaRadius) {
        ghost.takeDamage(this.config.damage);
      }
    }
  }

  drawCannonBlast(target) {
    this.laser.clear();
    
    const barrelX = this.sprite.x + 14;
    const barrelY = this.sprite.y - 4;
    const tx = target.sprite.x;
    const ty = target.sprite.y;

    // Impact circle at target location
    this.laser.lineStyle(3, 0xff9900, 0.8);
    this.laser.strokeCircle(tx, ty, this.config.areaRadius);

    // Filled impact
    this.laser.fillStyle(0xff6600, 0.3);
    this.laser.fillCircle(tx, ty, this.config.areaRadius);

    // Blast line from cannon to impact
    this.laser.lineStyle(2, 0xffcc00, 1);
    this.laser.beginPath();
    this.laser.moveTo(barrelX, barrelY);
    this.laser.lineTo(tx, ty);
    this.laser.strokePath();

    // Schedule clear after a short delay
    this.scene.time.delayedCall(200, () => {
      this.laser.clear();
    });
  }
}
