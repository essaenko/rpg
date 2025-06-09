import { Scene } from 'phaser';
import { Client } from 'colyseus.js';
import { World } from '@client/scenes/world/world';
import { Networking } from '@client/services/networking';
import { WorldScene } from '@client/core/scene/world-scene';

export class Boot extends Scene {
  constructor() {
    super('boot');
  }

  preload(): void {}

  create() {
    // await this.game.canvas.requestFullscreen();
    /*
      TODO: Add proper session/auth check and navigate to LoginScene
     */
    Networking.instance.joinRoom().then(({ scene }) => {
      this.scene.add('world', new WorldScene(scene), true);
    });

    this.generateTextures()
  }

  generateTextures() {
    const g = this.add.graphics({
      x: 0,
      y: 0,
      lineStyle: {
        width: 5,
        color: 0xffd600,
        alpha: 1,
      },
    });
    g.strokeEllipse(65, 30, 100, 50);
    g.generateTexture('target_round', 130, 60);

    g.clear();

    g.lineStyle(5, 0xffd600, 1);
    g.strokeCircle(55, 55, 50);
    g.generateTexture('pointer_circle', 120, 120);

    g.clear();

    g.destroy(true);
  }
}
