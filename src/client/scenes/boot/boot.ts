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
  }
}
