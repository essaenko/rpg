import { Scene } from 'phaser';
import { Client } from 'colyseus.js';

export class Boot extends Scene {
  constructor() {
    super('boot');
  }

  init(): void {
    this.registry.set('scene', 'boot');
  }
  preload(): void {}
  async create(): Promise<void> {
    const client = this.registry.get('client');

    if (client && client instanceof Client) {
      const response = await client.http.get('/scene');

      if (response.statusCode === 200 && response.data) {
        try {
          const data = JSON.parse(response.data);

          if ('scene' in data && data.scene) {
            this.scene.start(data.scene);
          }
        } catch (e) {
          console.log(e);
          alert('Error');
        }
      }
    }
  }
}
