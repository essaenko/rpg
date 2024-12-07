import { System } from '@client/core/ecs/system';
import { ECSContainer } from '@client/core/ecs';
import { Room } from 'colyseus.js';
import type { SceneState } from '@shared/schemas/scene';
import { CameraComponent } from '@client/ecs/components/game/camera';
import { SpriteComponent } from '@client/ecs/components/game/asset/sprite';
import { AppearanceComponent } from '@client/ecs/components/game/appearance';

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
        const camera = player.get<CameraComponent>('camera');
        const sprite = player.get<AppearanceComponent>('appearance');

        if (!camera.following && sprite.sprites) {
          scene.cameras.main.startFollow(sprite.sprites, true);
          scene.cameras.main.setLerp(0.02, 0.02);
          camera.following = true;
        }
      }
    }
  }
}
