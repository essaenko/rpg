import { System } from '@client/core/ecs/system';
import { ECSContainer } from '@client/core/ecs';
import { Room } from 'colyseus.js';
import type { SceneState } from '@shared/schemas/scene';
import { CameraComponent } from '@client/ecs/components/game/camera';
import { SpriteComponent } from '@client/ecs/components/game/asset/sprite';

export class CameraSystem extends System {
  constructor(public room: Room<SceneState>) {
    super('camera');
  }
  onUpdate(scene: Phaser.Scene, container: ECSContainer): void {
    if (this.room) {
      const player = container
        .query(['tag-player', 'camera', 'sprite'])
        .find((entity) => entity.id === this.room.sessionId);

      if (player) {
        const camera = player.get<CameraComponent>('camera');
        const sprite = player.get<SpriteComponent>('sprite');

        if (!camera.following && sprite.sprite) {
          scene.cameras.main.startFollow(sprite.sprite, true);
          scene.cameras.main.setLerp(0.02, 0.02);
          camera.following = true;
        }
      }
    }
  }
}
