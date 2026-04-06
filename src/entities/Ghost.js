import {
  LANE_Y,
  GHOST_GOAL_X,
  GHOST_RETURN_X,
  CARRY_SPEED_MULT,
} from '../config/constants.js';

// Stats for all entity types (ghosts and monsters share the same movement model)
const STATS = {
  'ghost-regular':  { speed: 80,  hp: 2, crystals: 5,  scale: 1.0  },
  'ghost-fast':     { speed: 155, hp: 1, crystals: 3,  scale: 0.75 },
  'ghost-tank':     { speed: 38,  hp: 5, crystals: 10, scale: 1.4  },
  'monster-zombie': { speed: 65,  hp: 3, crystals: 7,  scale: 1.1  },
  'monster-bat':    { speed: 185, hp: 1, crystals: 4,  scale: 0.8  },
  'monster-ogre':   { speed: 28,  hp: 8, crystals: 14, scale: 1.6  },
};

export default class Ghost {
  constructor(scene, type, spawnX) {
    this.scene    = scene;
    this.type     = type;
    this.state    = 'walking'; // walking | retreating | dead
    this.hasSweet = false;
    this.slowMultiplier = 1; // Slowed by ice towers

    const s = STATS[type];
    if (!s) throw new Error(`Unknown enemy type: "${type}"`);

    this.baseSpeed    = s.speed;
    this.hp           = s.hp;
    this.maxHp        = s.hp;
    this.crystalValue = s.crystals;

    this.sprite = scene.add.image(spawnX, LANE_Y, type)
      .setScale(s.scale)
      .setDepth(5);

    this.hpBarBg   = scene.add.graphics().setDepth(6);
    this.hpBarFill = scene.add.graphics().setDepth(6);

    this.sweetIndicator = scene.add.image(0, 0, 'sweet-icon')
      .setScale(0.7)
      .setDepth(7)
      .setVisible(false);

    this.drawHpBar();
  }

  get speed() {
    let speed = this.hasSweet ? this.baseSpeed * CARRY_SPEED_MULT : this.baseSpeed;
    return speed * this.slowMultiplier;
  }

  update(delta) {
    if (this.state === 'dead') return;

    const dt = delta / 1000;

    if (this.state === 'walking') {
      this.sprite.x += this.speed * dt;
      if (this.sprite.x >= GHOST_GOAL_X) {
        this.arriveAtHouse();
      }
    } else if (this.state === 'retreating') {
      this.sprite.x -= this.speed * dt;
      if (this.sprite.x <= GHOST_RETURN_X) {
        this.arriveAtCave();
      }
    }

    this.drawHpBar();
    this.sweetIndicator.setPosition(
      this.sprite.x,
      this.sprite.y - 46 * this.sprite.scaleY
    );
  }

  arriveAtHouse() {
    const stolen = this.scene.onGhostReachHouse(this);
    this.hasSweet = stolen;
    if (stolen) this.sweetIndicator.setVisible(true);
    this.state = 'retreating';
    this.sprite.setFlipX(true);
  }

  arriveAtCave() {
    this.scene.onGhostReachCave(this);
  }

  takeDamage(amount) {
    if (this.state === 'dead') return;
    this.hp -= amount;
    this.drawHpBar();

    this.scene.tweens.add({
      targets: this.sprite,
      alpha: 0.25,
      duration: 70,
      yoyo: true,
    });

    if (this.hp <= 0) this.die();
  }

  die() {
    this.state = 'dead';
    this.scene.onGhostDied(this);
    this.destroy();
  }

  drawHpBar() {
    if (this.state === 'dead') return;

    const bw = 34;
    const bh = 5;
    const bx = this.sprite.x - bw / 2;
    const by = this.sprite.y - 52 * this.sprite.scaleY;

    this.hpBarBg.clear();
    this.hpBarBg.fillStyle(0x222222, 0.8);
    this.hpBarBg.fillRect(bx, by, bw, bh);

    const pct   = Math.max(0, this.hp / this.maxHp);
    const color = pct > 0.5 ? 0x44ee44 : pct > 0.25 ? 0xffaa00 : 0xff2222;
    this.hpBarFill.clear();
    this.hpBarFill.fillStyle(color);
    this.hpBarFill.fillRect(bx, by, bw * pct, bh);
  }

  destroy() {
    this.state = 'dead';
    this.sprite.destroy();
    this.hpBarBg.destroy();
    this.hpBarFill.destroy();
    this.sweetIndicator.destroy();
  }
}
