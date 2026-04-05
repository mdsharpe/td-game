// BootScene: generates all placeholder textures programmatically, then starts MenuScene.
// Replace generateTexture calls with real asset loads once artwork is ready.

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create() {
    // Ghosts
    this.makeGhost('ghost-regular', 0xdde0ff, 40, 52);
    this.makeGhost('ghost-fast',    0xaaddff, 30, 40);
    this.makeGhost('ghost-tank',    0x9999bb, 56, 68);

    // Monsters
    this.makeZombie();
    this.makeBat();
    this.makeOgre();

    // Other
    this.makeTower();
    this.makeSweet();
    this.makeCrystal();

    this.scene.start('MenuScene');
  }

  // ─── Ghosts ──────────────────────────────────────────────────────────────

  makeGhost(key, colour, w, h) {
    const g = this.make.graphics({ x: 0, y: 0, add: false });

    g.fillStyle(colour, 0.92);
    g.fillEllipse(w / 2, h * 0.38, w * 0.9, h * 0.65);

    // Wiggly skirt — three rounded bumps
    const bw = Math.floor(w / 3);
    g.fillEllipse(bw * 0.5 + 1,       h * 0.78, bw, bw * 1.1);
    g.fillEllipse(bw * 1.5 + 1,       h * 0.82, bw, bw * 1.0);
    g.fillEllipse(bw * 2.5 + 1,       h * 0.78, bw, bw * 1.1);
    g.fillRect(1, h * 0.6, w - 2, h * 0.22); // fill gap

    // Eyes
    g.fillStyle(0x222244);
    g.fillCircle(w * 0.33, h * 0.32, w * 0.10);
    g.fillCircle(w * 0.67, h * 0.32, w * 0.10);
    g.fillStyle(0xffffff);
    g.fillCircle(w * 0.33 + 2, h * 0.30, w * 0.04);
    g.fillCircle(w * 0.67 + 2, h * 0.30, w * 0.04);

    g.generateTexture(key, w, h);
    g.destroy();
  }

  // ─── Monsters ────────────────────────────────────────────────────────────

  makeZombie() {
    // Green lumpy humanoid blob
    const w = 38, h = 52;
    const g = this.make.graphics({ x: 0, y: 0, add: false });

    // Body — squarish torso
    g.fillStyle(0x559944, 0.95);
    g.fillRoundedRect(5, 14, 28, 30, 6);

    // Head — slightly different shade
    g.fillStyle(0x66bb55, 0.95);
    g.fillCircle(19, 12, 13);

    // Ragged bottom edge (stumpy legs)
    g.fillStyle(0x559944);
    g.fillRect(5,  40, 10, 12);
    g.fillRect(23, 40, 10, 12);

    // Outstretched arms
    g.fillStyle(0x559944);
    g.fillRect(0,  20, 8, 7);   // left arm
    g.fillRect(30, 20, 8, 7);   // right arm

    // Eyes — white with dark pupils
    g.fillStyle(0xeeeedd);
    g.fillCircle(13, 11, 5);
    g.fillCircle(25, 11, 5);
    g.fillStyle(0x111100);
    g.fillCircle(14, 11, 3);
    g.fillCircle(26, 11, 3);
    // Red pupils (zombie)
    g.fillStyle(0xcc2200);
    g.fillCircle(14, 11, 1);
    g.fillCircle(26, 11, 1);

    g.generateTexture('monster-zombie', w, h);
    g.destroy();
  }

  makeBat() {
    // Small dark bat with wings spread
    const w = 44, h = 28;
    const g = this.make.graphics({ x: 0, y: 0, add: false });

    // Wings — dark purple arcs (two triangles)
    g.fillStyle(0x4422aa, 0.9);
    g.fillTriangle(22, 14,  0, 4,   10, 26);  // left wing
    g.fillTriangle(22, 14, 44, 4,   34, 26);  // right wing

    // Wing membrane detail
    g.fillStyle(0x6644cc, 0.6);
    g.fillTriangle(22, 14,  4,  6,  10, 22);
    g.fillTriangle(22, 14, 40,  6,  34, 22);

    // Body
    g.fillStyle(0x221133);
    g.fillEllipse(22, 16, 14, 18);

    // Ears
    g.fillStyle(0x221133);
    g.fillTriangle(15, 8, 13, 0, 19, 6);
    g.fillTriangle(29, 8, 31, 0, 25, 6);

    // Eyes
    g.fillStyle(0xff3300);
    g.fillCircle(18, 14, 3);
    g.fillCircle(26, 14, 3);
    g.fillStyle(0xff8866);
    g.fillCircle(19, 13, 1);
    g.fillCircle(27, 13, 1);

    g.generateTexture('monster-bat', w, h);
    g.destroy();
  }

  makeOgre() {
    // Large, stocky brownish-orange brute
    const w = 60, h = 72;
    const g = this.make.graphics({ x: 0, y: 0, add: false });

    // Legs
    g.fillStyle(0x885522);
    g.fillRect(8,  56, 16, 16);
    g.fillRect(36, 56, 16, 16);

    // Body — big round torso
    g.fillStyle(0xcc7733, 0.95);
    g.fillEllipse(30, 44, 52, 42);

    // Arms — chunky, hang low
    g.fillStyle(0xcc7733);
    g.fillRoundedRect(0,  32, 12, 28, 5);  // left arm
    g.fillRoundedRect(48, 32, 12, 28, 5);  // right arm
    // Fists
    g.fillStyle(0xbb6622);
    g.fillCircle(6,  60, 8);
    g.fillCircle(54, 60, 8);

    // Head
    g.fillStyle(0xdd8844, 0.95);
    g.fillCircle(30, 20, 20);

    // Brow ridge
    g.fillStyle(0xbb6622);
    g.fillRect(12, 10, 36, 7);

    // Eyes — small, mean, deep-set
    g.fillStyle(0x220000);
    g.fillCircle(22, 19, 5);
    g.fillCircle(38, 19, 5);
    g.fillStyle(0xffaa00);
    g.fillCircle(22, 19, 2);
    g.fillCircle(38, 19, 2);

    // Nose
    g.fillStyle(0xaa5511);
    g.fillCircle(30, 26, 4);

    // Mouth — wide grin with teeth
    g.fillStyle(0x331100);
    g.fillRect(18, 31, 24, 6);
    g.fillStyle(0xffeedd);
    g.fillRect(20, 31, 5, 5);
    g.fillRect(28, 31, 5, 5);
    g.fillRect(36, 31, 5, 5);

    g.generateTexture('monster-ogre', w, h);
    g.destroy();
  }

  // ─── Tower / pickups ─────────────────────────────────────────────────────

  makeTower() {
    const w = 48, h = 60;
    const g = this.make.graphics({ x: 0, y: 0, add: false });

    g.fillStyle(0x8b7355);
    g.fillRect(8, 44, 32, 16);       // stone base

    g.fillStyle(0x6a7d8f);
    g.fillRect(10, 14, 28, 34);      // tower body

    g.fillStyle(0x6a7d8f);           // battlements
    g.fillRect(8,  6, 9, 12);
    g.fillRect(20, 6, 9, 12);
    g.fillRect(32, 6, 9, 12);

    g.fillStyle(0x444455);
    g.fillRect(34, 24, 14, 8);       // barrel

    g.fillStyle(0xff3333);
    g.fillCircle(48, 28, 3);         // barrel tip glow

    g.generateTexture('tower', w, h);
    g.destroy();
  }

  makeSweet() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0xff5599);
    g.fillCircle(10, 10, 9);
    g.fillStyle(0xff88bb);
    g.fillCircle(7, 7, 4);
    g.generateTexture('sweet-icon', 20, 20);
    g.destroy();
  }

  makeCrystal() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0x3399ff);
    g.fillTriangle(8, 0,  16, 9,  8, 20);
    g.fillTriangle(8, 0,   0, 9,  8, 20);
    g.fillStyle(0x88ccff);
    g.fillTriangle(8, 2,  14, 9,  8, 9);
    g.generateTexture('crystal-icon', 16, 20);
    g.destroy();
  }
}
