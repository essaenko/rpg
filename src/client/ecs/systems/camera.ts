import { System } from '@client/core/ecs/system';
import { ECSContainer } from '@client/core/ecs';
import { Room } from 'colyseus.js';
import type { SceneState } from '@shared/schemas/scene';
import { Camera } from '@client/ecs/components/game/camera';
import { Appearance } from '@client/ecs/components/game/visual/appearance';
import { DEFAULT_LERP_VALUE } from '@client/utils/const';

export class CameraSystem extends System {
  private debugGraphics: Phaser.GameObjects.Graphics;
  constructor(public room: Room<SceneState>) {
    super('camera');
  }
  onUpdate(scene: Phaser.Scene, container: ECSContainer): void {
    if (this.room) {
      if (!this.debugGraphics) {
        // this.debugGraphics = scene.add.graphics({ lineStyle: { width: 2, color: 0xff0000 } });
      }
      const player = container
        .query(['tag-player', 'camera', 'appearance'])
        .find((entity) => entity.id === this.room.sessionId);

      if (player) {
        const camera = player.get<Camera>('camera');
        const sprite = player.get<Appearance>('appearance');

        if (!camera.following && sprite.sprites) {
          scene.cameras.main.startFollow(sprite.sprites, true, DEFAULT_LERP_VALUE, DEFAULT_LERP_VALUE, 50, 50);
          camera.following = true;
        }
      }

      // Отладка границ камеры
      // this.debugGraphics.clear();
      // this.debugGraphics.strokeRect(
      //   scene.cameras.main.worldView.x,
      //   scene.cameras.main.worldView.y,
      //   scene.cameras.main.worldView.width,
      //   scene.cameras.main.worldView.height,
      // );
    }
  }
}
