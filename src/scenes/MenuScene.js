export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    const W = this.scale.width;
    const H = this.scale.height;

    // Sky
    this.add.rectangle(0, 0, W, H, 0x5588cc).setOrigin(0);
    // Ground
    this.add.rectangle(0, H * 0.72, W, H * 0.28, 0x3a6e28).setOrigin(0);

    // A few trees for atmosphere
    const g = this.add.graphics();
    for (let i = 0; i < 8; i++) {
      const tx = 80 + i * 115;
      const ty = H * 0.72;
      g.fillStyle(0x4a3520);
      g.fillRect(tx - 6, ty - 65, 12, 65);
      g.fillStyle(0x2a7a2a);
      g.fillCircle(tx, ty - 90, 38);
      g.fillStyle(0x33993a);
      g.fillCircle(tx, ty - 115, 28);
    }

    // Title
    this.add.text(W / 2, H * 0.22, 'Ghost Tower', {
      fontSize: '68px',
      fontFamily: 'Georgia, serif',
      color: '#ffffff',
      stroke: '#223388',
      strokeThickness: 9,
    }).setOrigin(0.5);

    this.add.text(W / 2, H * 0.40, 'Defend your sweets!', {
      fontSize: '28px',
      fontFamily: 'Georgia, serif',
      color: '#ffeecc',
      stroke: '#333333',
      strokeThickness: 4,
    }).setOrigin(0.5);

    // Play button
    const btn = this.add.text(W / 2, H * 0.60, '  ▶  Play  ', {
      fontSize: '38px',
      fontFamily: 'Arial, sans-serif',
      color: '#ffffff',
      backgroundColor: '#446acc',
      padding: { x: 28, y: 14 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    btn.on('pointerover', () => btn.setStyle({ backgroundColor: '#6688ee' }));
    btn.on('pointerout',  () => btn.setStyle({ backgroundColor: '#446acc' }));
    btn.on('pointerdown', () => this.scene.start('GameScene'));

    // Decorative ghosts
    const g1 = this.add.image(W * 0.12, H * 0.52, 'ghost-regular').setScale(2).setAlpha(0.75);
    const g2 = this.add.image(W * 0.88, H * 0.52, 'ghost-tank').setScale(2).setAlpha(0.75).setFlipX(true);
    const g3 = this.add.image(W * 0.50, H * 0.80, 'ghost-fast').setScale(1.5).setAlpha(0.6);

    this.tweens.add({ targets: g1, y: H * 0.52 - 14, duration: 1900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    this.tweens.add({ targets: g2, y: H * 0.52 - 14, duration: 2300, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    this.tweens.add({ targets: g3, y: H * 0.80 - 10, duration: 1600, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
  }
}
