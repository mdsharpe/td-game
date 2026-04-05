export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  init(data) {
    this.won    = data.won    ?? false;
    this.sweets = data.sweets ?? 0;
    this.wave   = data.wave   ?? 0;
  }

  create() {
    const W = this.scale.width;
    const H = this.scale.height;

    // Background
    this.add.rectangle(0, 0, W, H, this.won ? 0x224422 : 0x220000).setOrigin(0);

    // Stars / particles for win
    if (this.won) {
      const g = this.add.graphics();
      for (let i = 0; i < 40; i++) {
        g.fillStyle(0xffff88, Phaser.Math.FloatBetween(0.3, 0.9));
        g.fillCircle(
          Phaser.Math.Between(0, W),
          Phaser.Math.Between(0, H),
          Phaser.Math.Between(1, 4)
        );
      }
    }

    // Title
    this.add.text(W / 2, H * 0.22, this.won ? '🎉 You Win! 🎉' : '👻 Game Over!', {
      fontSize: '60px',
      fontFamily: 'Georgia, serif',
      color: this.won ? '#ffff66' : '#ff5555',
      stroke: '#000000',
      strokeThickness: 7,
    }).setOrigin(0.5);

    // Result message
    const msg = this.won
      ? `All waves defeated!\n${this.sweets} 🍬 still safe at home.`
      : `The ghosts stole all your sweets!\nYou reached wave ${this.wave + 1}.`;

    this.add.text(W / 2, H * 0.46, msg, {
      fontSize: '26px',
      fontFamily: 'Arial',
      color: '#ffffff',
      stroke: '#222',
      strokeThickness: 3,
      align: 'center',
      lineSpacing: 8,
    }).setOrigin(0.5);

    // Play Again button
    const playBtn = this.add.text(W / 2, H * 0.67, '  Play Again  ', {
      fontSize: '36px',
      fontFamily: 'Arial',
      color: '#ffffff',
      backgroundColor: '#3355bb',
      padding: { x: 26, y: 12 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    playBtn.on('pointerover', () => playBtn.setStyle({ backgroundColor: '#5577dd' }));
    playBtn.on('pointerout',  () => playBtn.setStyle({ backgroundColor: '#3355bb' }));
    playBtn.on('pointerdown', () => this.scene.start('GameScene'));

    // Main Menu button
    const menuBtn = this.add.text(W / 2, H * 0.82, 'Main Menu', {
      fontSize: '24px',
      fontFamily: 'Arial',
      color: '#aaaaaa',
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    menuBtn.on('pointerover', () => menuBtn.setStyle({ color: '#ffffff' }));
    menuBtn.on('pointerout',  () => menuBtn.setStyle({ color: '#aaaaaa' }));
    menuBtn.on('pointerdown', () => this.scene.start('MenuScene'));
  }
}
