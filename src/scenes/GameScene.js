import Ghost from '../entities/Ghost.js';
import Tower from '../entities/Tower.js';
import { WAVES } from '../config/waves.js';
import {
  GAME_WIDTH, GAME_HEIGHT,
  LANE_Y, PATH_TOP, PATH_BOTTOM,
  CAVE_END, PLAYPARK_END, FOREST_END, HOUSE_X,
  GHOST_SPAWN_X,
  STARTING_SWEETS, STARTING_CRYSTALS, TOWER_COST,
  PLACE_START, PLACE_END,
} from '../config/constants.js';

const TOTAL_WAVES = WAVES.length;

export default class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    this.sweetsInHouse = STARTING_SWEETS;
    this.sweetsLost    = 0;
    this.crystals      = STARTING_CRYSTALS;
    this.waveIndex     = 0;
    this.ghosts        = [];
    this.towers        = [];
    this.waveActive    = false;
    this.spawnQueue    = [];
    this.spawnElapsed  = 0;
    this.panelOpen     = false;
    this.isGameOver    = false;

    this.drawBackground();
    this.createSweetDisplay();
    this.setupInput();
    this.setupHUD();
    this.showWavePanel();
  }

  // ─── Input ─────────────────────────────────────────────────────────────────

  setupInput() {
    // gameobjectdown fires before the scene's pointerdown, so we can reliably
    // detect button clicks and suppress the tower-placement that would otherwise
    // fire on the paired pointerup.
    this.input.on('gameobjectdown', () => {
      this._suppressTap = true;
    });

    this.input.on('pointerup', (ptr) => {
      if (!this._suppressTap && !this.isGameOver) {
        this.tryPlaceTower(ptr.x, ptr.y);
      }
      this._suppressTap = false;
    });
  }

  tryPlaceTower(wx, wy) {
    if (wx < PLACE_START || wx > PLACE_END) return;
    if (wy >= PATH_TOP - 8)                 return;
    if (wy < 52)                            return;

    if (this.crystals < TOWER_COST) {
      this.floatText(wx, wy, `Need ${TOWER_COST} 💎`, '#ff8844');
      return;
    }

    for (const t of this.towers) {
      if (Phaser.Math.Distance.Between(wx, wy, t.x, t.y) < 44) {
        this.floatText(wx, wy, 'Too close!', '#ff8844');
        return;
      }
    }

    this.crystals -= TOWER_COST;
    this.towers.push(new Tower(this, wx, wy));
    this.updateHUD();
    this.floatText(wx, wy - 28, `-${TOWER_COST} 💎`, '#88bbff');
  }

  // ─── Background ────────────────────────────────────────────────────────────

  drawBackground() {
    // Sky
    this.add.rectangle(0, 0, GAME_WIDTH, GAME_HEIGHT, 0x5599cc)
      .setOrigin(0).setDepth(0);

    // Zone backdrops
    this.add.rectangle(0,          0, CAVE_END,                  GAME_HEIGHT, 0x1e1e24)
      .setOrigin(0).setDepth(0);
    this.add.rectangle(CAVE_END,   0, PLAYPARK_END - CAVE_END,   GAME_HEIGHT, 0x55992a)
      .setOrigin(0).setDepth(0);
    this.add.rectangle(PLAYPARK_END, 0, FOREST_END - PLAYPARK_END, GAME_HEIGHT, 0x336622)
      .setOrigin(0).setDepth(0);
    // House zone keeps sky colour

    // Trees in forest zone
    const treeGfx = this.add.graphics().setDepth(1);
    for (let tx = PLAYPARK_END + 55; tx < FOREST_END - 30; tx += 68) {
      const jitter = Phaser.Math.Between(-10, 10);
      this.drawTree(treeGfx, tx + jitter, PATH_TOP);
    }

    // Common ground & path
    this.add.rectangle(0, PATH_BOTTOM, GAME_WIDTH, GAME_HEIGHT - PATH_BOTTOM, 0x4a8030)
      .setOrigin(0).setDepth(2);
    this.add.rectangle(0, PATH_TOP, GAME_WIDTH, PATH_BOTTOM - PATH_TOP, 0xc8a060)
      .setOrigin(0).setDepth(2);

    // Path edge lines
    const pathEdge = this.add.graphics().setDepth(2);
    pathEdge.lineStyle(2, 0x9a7040, 0.6);
    pathEdge.strokeRect(0, PATH_TOP, GAME_WIDTH, PATH_BOTTOM - PATH_TOP);

    this.drawCave();
    this.drawPlaypark();
    this.drawHouse();
  }

  drawTree(g, x, groundY) {
    g.fillStyle(0x5c3a1a);
    g.fillRect(x - 7, groundY - 68, 14, 68);
    g.fillStyle(0x2a7a2a);
    g.fillCircle(x, groundY - 95, 36);
    g.fillStyle(0x338833);
    g.fillCircle(x - 5, groundY - 120, 27);
    g.fillStyle(0x44aa44);
    g.fillCircle(x + 4, groundY - 140, 19);
  }

  drawCave() {
    const g = this.add.graphics().setDepth(3);

    g.fillStyle(0x1e1e24);
    g.fillRect(0, 0, CAVE_END, GAME_HEIGHT);

    // Stone texture hints
    g.fillStyle(0x2e2e38);
    [
      [10, 80, 40, 18], [55, 55, 30, 14], [15, 200, 50, 20],
      [70, 160, 35, 16], [20, 300, 45, 18], [60, 280, 28, 12],
      [10, 420, 50, 16], [75, 460, 30, 14],
    ].forEach(([x, y, w, h]) => g.fillRect(x, y, w, h));

    // Cave mouth arch
    g.fillStyle(0x0a0a10);
    g.fillEllipse(CAVE_END / 2, PATH_TOP + 2, 100, 90);

    this.add.text(CAVE_END / 2, 22, 'Cave', {
      fontSize: '17px', fontFamily: 'Arial', color: '#666677',
    }).setOrigin(0.5).setDepth(4);
  }

  drawPlaypark() {
    const px = CAVE_END;   // left edge of playpark
    const pw = PLAYPARK_END - CAVE_END;
    const g  = this.add.graphics().setDepth(3);

    // Grass
    g.fillStyle(0x66bb44);
    g.fillRect(px, 0, pw, GAME_HEIGHT);

    // ── Swings (centred around px+100) ──────────────
    const sw = px + 100;
    const postH = 110;
    const crossY = PATH_TOP - postH;

    // Posts
    g.fillStyle(0x886622);
    g.fillRect(sw - 55, crossY, 8, postH);
    g.fillRect(sw + 47, crossY, 8, postH);
    // Crossbar
    g.fillRect(sw - 55, crossY, 110, 8);

    // Two swing seats
    const swingSeats = [
      { x: sw - 30, ropeLen: 70 },
      { x: sw + 22, ropeLen: 60 },
    ];
    swingSeats.forEach(({ x, ropeLen }) => {
      // Rope lines
      g.lineStyle(2, 0x886622, 1);
      g.beginPath();
      g.moveTo(x - 8, crossY + 8);
      g.lineTo(x - 8, crossY + 8 + ropeLen);
      g.moveTo(x + 8, crossY + 8);
      g.lineTo(x + 8, crossY + 8 + ropeLen);
      g.strokePath();
      // Seat plank
      g.fillStyle(0xcc9944);
      g.fillRect(x - 10, crossY + 8 + ropeLen, 20, 6);
    });

    // ── Slide (centred around px+220) ───────────────
    const sl = px + 220;
    const platformY = PATH_TOP - 95;

    // Ladder rungs (left side)
    g.fillStyle(0xcc6633);
    g.fillRect(sl - 16, platformY, 6, 95);    // left rail
    g.fillRect(sl - 6,  platformY, 6, 95);    // right rail
    for (let ry = platformY + 12; ry < PATH_TOP - 5; ry += 18) {
      g.fillRect(sl - 16, ry, 22, 5);         // rungs
    }

    // Platform
    g.fillStyle(0xdd8844);
    g.fillRect(sl - 18, platformY - 8, 36, 10);

    // Slide chute
    g.fillStyle(0xeebb55);
    g.fillTriangle(
      sl + 18, platformY,
      sl + 18 + 80, PATH_TOP,
      sl + 18 + 80 + 14, PATH_TOP
    );
    // Slide side rails
    g.fillStyle(0xcc9933);
    g.fillRect(sl + 16, platformY - 6, 6, 10);

    // ── Roundabout (centred around px+185, lower) ──
    const rb = px + 185;
    const rbY = PATH_TOP + 14;
    g.fillStyle(0x888888);
    g.fillCircle(rb, rbY, 4);               // centre pole
    g.lineStyle(6, 0xcc4444, 1);
    // 4 spokes
    [[rb - 28, rbY], [rb + 28, rbY], [rb, rbY - 28], [rb, rbY + 28]].forEach(([ex, ey]) => {
      g.beginPath(); g.moveTo(rb, rbY); g.lineTo(ex, ey); g.strokePath();
    });
    g.lineStyle(5, 0xcc4444, 1);
    g.strokeCircle(rb, rbY, 28);

    // Zone label
    this.add.text(px + pw / 2, 22, 'Playpark', {
      fontSize: '17px', fontFamily: 'Arial', color: '#336622',
    }).setOrigin(0.5).setDepth(4);
  }

  drawHouse() {
    const hx = HOUSE_X;
    const gy = PATH_TOP;
    const g  = this.add.graphics().setDepth(3);

    // House body
    g.fillStyle(0xf0ddb0);
    g.fillRect(hx, gy - 115, 148, 115);

    // Roof
    g.fillStyle(0xbb3333);
    g.fillTriangle(hx - 10, gy - 115,  hx + 74, gy - 198,  hx + 158, gy - 115);

    // Chimney
    g.fillStyle(0xaa4444);
    g.fillRect(hx + 105, gy - 195, 22, 52);

    // Left window (with sweets visible behind it)
    g.fillStyle(0x99ccee);
    g.fillRect(hx + 14, gy - 95, 36, 28);
    g.lineStyle(2, 0x887755);
    g.strokeRect(hx + 14, gy - 95, 36, 28);
    // Cross
    g.beginPath();
    g.moveTo(hx + 32, gy - 95); g.lineTo(hx + 32, gy - 67);
    g.moveTo(hx + 14, gy - 81); g.lineTo(hx + 50, gy - 81);
    g.strokePath();

    // Right window
    g.fillStyle(0x99ccee);
    g.fillRect(hx + 98, gy - 95, 36, 28);
    g.lineStyle(2, 0x887755);
    g.strokeRect(hx + 98, gy - 95, 36, 28);
    g.beginPath();
    g.moveTo(hx + 116, gy - 95); g.lineTo(hx + 116, gy - 67);
    g.moveTo(hx + 98,  gy - 81); g.lineTo(hx + 134, gy - 81);
    g.strokePath();

    // Door
    g.fillStyle(0x7a3e10);
    g.fillRect(hx + 56, gy - 52, 36, 52);
    g.fillStyle(0xddaa22);
    g.fillCircle(hx + 88, gy - 27, 4);   // door knob

    // House label
    this.add.text(hx + 74, gy - 218, 'Home', {
      fontSize: '17px', fontFamily: 'Arial', color: '#ffeecc',
      stroke: '#333', strokeThickness: 3,
    }).setOrigin(0.5).setDepth(4);
  }

  // ─── Sweet display ─────────────────────────────────────────────────────────

  createSweetDisplay() {
    // 10 sweet icons arranged in a 5×2 grid near the house door, at ground level.
    // Visible from outside as a pile on the doorstep / just inside.
    this.sweetIcons = [];
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 5; col++) {
        const x = HOUSE_X + 20 + col * 20;
        const y = PATH_TOP - 8 - row * 18;
        const icon = this.add.image(x, y, 'sweet-icon')
          .setScale(0.75)
          .setDepth(5);
        this.sweetIcons.push(icon);
      }
    }
    this.refreshSweetDisplay();
  }

  refreshSweetDisplay() {
    this.sweetIcons.forEach((icon, i) => {
      icon.setVisible(i < this.sweetsInHouse);
    });
  }

  // ─── HUD ───────────────────────────────────────────────────────────────────

  setupHUD() {
    const hudBg = this.add.rectangle(0, 0, GAME_WIDTH, 50, 0x000000, 0.65)
      .setOrigin(0).setDepth(10);

    this.txtCrystals = this.add.text(16, 25, '', {
      fontSize: '21px', fontFamily: 'Arial', color: '#88ccff',
      stroke: '#000', strokeThickness: 3,
    }).setOrigin(0, 0.5).setDepth(11);

    this.txtWave = this.add.text(GAME_WIDTH / 2, 25, '', {
      fontSize: '21px', fontFamily: 'Arial', color: '#ffffff',
      stroke: '#000', strokeThickness: 3,
    }).setOrigin(0.5).setDepth(11);

    this.txtSweets = this.add.text(GAME_WIDTH - 16, 25, '', {
      fontSize: '21px', fontFamily: 'Arial', color: '#ffaacc',
      stroke: '#000', strokeThickness: 3,
    }).setOrigin(1, 0.5).setDepth(11);

    this.hintText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 8,
      `Tap the forest or playpark to place a tower  (costs ${TOWER_COST} 💎)`, {
      fontSize: '14px', fontFamily: 'Arial', color: '#bbbbbb',
      stroke: '#000', strokeThickness: 2,
    }).setOrigin(0.5, 1).setDepth(11);

    this.updateHUD();
  }

  updateHUD() {
    this.txtCrystals.setText(`💎 ${this.crystals}`);
    this.txtWave.setText(`Wave ${this.waveIndex + 1} / ${TOTAL_WAVES}`);
    this.txtSweets.setText(`🍬 ${this.sweetsInHouse} / ${STARTING_SWEETS}`);
  }

  // ─── Wave overlay panel (fixed to screen) ──────────────────────────────────

  showWavePanel() {
    this.panelOpen = true;
    const W = GAME_WIDTH, H = GAME_HEIGHT;
    const waveNum = this.waveIndex + 1;
    const isFirst = waveNum === 1;

    const panel = this.add.rectangle(W / 2, H / 2, 460, 200, 0x000000, 0.80).setDepth(20);

    const heading = this.add.text(W / 2, H / 2 - 65,
      isFirst ? 'Ghost Tower' : `Wave ${waveNum - 1} cleared!`, {
      fontSize: '30px', fontFamily: 'Georgia, serif', color: '#ffffff',
    }).setOrigin(0.5).setDepth(21);

    const sub = this.add.text(W / 2, H / 2 - 24,
      `Wave ${waveNum} of ${TOTAL_WAVES} is coming…`, {
      fontSize: '20px', fontFamily: 'Arial', color: '#ffeeaa',
    }).setOrigin(0.5).setDepth(21);

    const hint = this.add.text(W / 2, H / 2 + 14,
      `💎 ${this.crystals} crystals — place your towers!`, {
      fontSize: '15px', fontFamily: 'Arial', color: '#88ccff',
    }).setOrigin(0.5).setDepth(21);

    const btn = this.add.text(W / 2, H / 2 + 62,
      `  Start Wave ${waveNum}  `, {
      fontSize: '26px', fontFamily: 'Arial', color: '#ffffff',
      backgroundColor: '#336633',
      padding: { x: 18, y: 10 },
    }).setOrigin(0.5).setDepth(21).setInteractive({ useHandCursor: true });

    btn.on('pointerover', () => btn.setStyle({ backgroundColor: '#448844' }));
    btn.on('pointerout',  () => btn.setStyle({ backgroundColor: '#336633' }));
    btn.on('pointerdown', () => {
      [panel, heading, sub, hint, btn].forEach(o => o.destroy());
      this.panelOpen = false;
      this.startWave();
    });
  }

  startWave() {
    this.waveActive   = true;
    this.spawnQueue   = [...WAVES[this.waveIndex]];
    this.spawnElapsed = 0;
    this.updateHUD();
  }

  // ─── Main loop ─────────────────────────────────────────────────────────────

  update(_time, delta) {
    if (this.isGameOver) return;

    if (this.waveActive) {
      this.spawnElapsed += delta;
      while (this.spawnQueue.length > 0 && this.spawnElapsed >= this.spawnQueue[0].delay) {
        const { type } = this.spawnQueue.shift();
        this.ghosts.push(new Ghost(this, type, GHOST_SPAWN_X));
      }
    }

    for (let i = this.ghosts.length - 1; i >= 0; i--) {
      const gh = this.ghosts[i];
      gh.update(delta);
      if (gh.state === 'dead') this.ghosts.splice(i, 1);
    }

    for (const t of this.towers) {
      t.update(delta);
    }

    if (this.waveActive && this.spawnQueue.length === 0 && this.ghosts.length === 0) {
      this.waveActive = false;
      this.waveIndex++;
      if (this.waveIndex >= TOTAL_WAVES) {
        this.time.delayedCall(800, () => this.endGame(true));
      } else {
        this.time.delayedCall(600, () => this.showWavePanel());
      }
    }
  }

  // ─── Ghost event callbacks ─────────────────────────────────────────────────

  onGhostReachHouse(ghost) {
    if (this.sweetsInHouse <= 0) return false;
    this.sweetsInHouse--;
    this.updateHUD();
    this.refreshSweetDisplay();
    this.floatText(HOUSE_X + 50, PATH_TOP - 70, '-1 🍬', '#ff4466');
    return true;
  }

  onGhostReachCave(ghost) {
    if (ghost.hasSweet) {
      this.sweetsLost++;
    }
    ghost.destroy();

    if (this.sweetsLost >= STARTING_SWEETS) {
      this.time.delayedCall(400, () => this.endGame(false));
    }
  }

  onGhostDied(ghost) {
    if (ghost.hasSweet) {
      this.sweetsInHouse = Math.min(this.sweetsInHouse + 1, STARTING_SWEETS);
      this.updateHUD();
      this.refreshSweetDisplay();
      this.floatText(ghost.sprite.x, ghost.sprite.y - 30, '🍬 Saved!', '#ff99cc');
    }
    this.crystals += ghost.crystalValue;
    this.updateHUD();
    this.floatText(ghost.sprite.x, ghost.sprite.y - 52, `+${ghost.crystalValue} 💎`, '#88ccff');
  }

  // ─── End game ──────────────────────────────────────────────────────────────

  endGame(won) {
    if (this.isGameOver) return;
    this.isGameOver = true;
    this.scene.start('GameOverScene', {
      won,
      sweets: this.sweetsInHouse,
      wave: this.waveIndex,
    });
  }

  // ─── Floating text ─────────────────────────────────────────────────────────

  floatText(x, y, text, color = '#ffffff') {
    const t = this.add.text(x, y, text, {
      fontSize: '19px', fontFamily: 'Arial',
      color, stroke: '#000000', strokeThickness: 3,
    }).setOrigin(0.5).setDepth(15);

    this.tweens.add({
      targets: t,
      y: y - 55,
      alpha: 0,
      duration: 1100,
      ease: 'Power2',
      onComplete: () => t.destroy(),
    });
  }
}
