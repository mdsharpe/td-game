import Tower from './Tower.js';

export default class LaserTower extends Tower {
  constructor(scene, x, y) {
    super(scene, x, y, 'laser');
  }

  // Inherits all behavior from Tower (laser is the default behavior)
}
