import { System } from '@client/core/ecs/system';
import { ECSContainer } from '@client/core/ecs';
import { Room } from 'colyseus.js';
import type { SceneState } from '@shared/schemas/scene';
import { Camera } from '@client/ecs/components/game/camera';
import { Appearance } from '@client/ecs/components/game/appearance';

export class CameraSystem extends System {
  constructor(public room: Room<SceneState>) {
    super('camera');
  }
  onUpdate(scene: Phaser.Scene, container: ECSContainer): void {
    if (this.room) {
      const player = container
        .query(['tag-player', 'camera', 'appearance'])
        .find((entity) => entity.id === this.room.sessionId);

      if (player) {
        const camera = player.get<Camera>('camera');
        const sprite = player.get<Appearance>('appearance');

        if (!camera.following && sprite.sprites) {
          scene.cameras.main.startFollow(sprite.sprites, true, 0.007, 0.007, 0, 0);
          camera.following = true;
        }
      }
    }
  }
}
