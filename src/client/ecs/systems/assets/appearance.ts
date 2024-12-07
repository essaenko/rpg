import { System } from '@client/core/ecs/system';
import { WorldScene } from '@client/core/scene/world-scene';
import { ECSContainer } from '@client/core/ecs';
import { AppearanceComponent } from '@client/ecs/components/game/appearance';
import { PositionComponent } from '@client/ecs/components/physics/position';
import { TargetComponent } from '@client/ecs/components/game/combat/target';
import { BodyComponent } from '@client/ecs/components/physics/body';

export class AppearanceSystem extends System {
  constructor() {
    super('appearance');
  }
  onUpdate(scene: WorldScene, container: ECSContainer): void {
    container.query(['appearance']).forEach((entity) => {
      const appearance = entity.get<AppearanceComponent>('appearance');
      const position = entity.get<PositionComponent>('position');
      const body = entity.get<BodyComponent>('body');

      if (appearance.loaded && !appearance.sprites) {
        appearance.sprites = scene.add.container(position.x, position.y);

        const sprite = scene.physics.add.sprite(0, 0, undefined);
        sprite.anims.createFromAseprite(appearance.key);

        appearance.sprites.add(sprite);
        appearance.sprites.setSize(body.width, body.height);
        appearance.sprites.setInteractive();

        appearance.sprites.on('pointerdown', () => {
          const player = container.getEntity(scene.room.sessionId);
          player?.removeComponent('target');
          container.query(['target-highlight']).forEach((entity) => {
            entity.removeComponent('target-highlight');
            entity.removeComponent('health-frame');
          });
          const target = new TargetComponent();
          target.target = entity.id;
          player?.addComponent(target);
        });
      }

      if (appearance.sprites) {
        appearance.sprites.depth = position.y + body.height / 2;
      }
    });
  }
}
