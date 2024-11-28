import { System } from '@client/core/ecs/system';
import { ECSContainer } from '@client/core/ecs';
import { PositionComponent } from '@client/ecs/components/physics/position';
import { SpriteComponent } from '@client/ecs/components/game/asset/sprite';
import { BodyComponent } from '@client/ecs/components/physics/body';
import { AsepriteAssetComponent } from '@client/ecs/components/game/asset/aseprite-asset';
import { SpriteAssetComponent } from '@client/ecs/components/game/asset/sprite-asset';
import { WorldScene } from '@client/core/scene/world-scene';
import { TargetComponent } from '@client/ecs/components/game/combat/target';
import { collide } from '@server/core/helpers/map';

export class SpriteSystem extends System {
  constructor() {
    super('sprite');
  }

  onUpdate(scene: WorldScene, container: ECSContainer): void {
    container.query(['sprite']).forEach((entity) => {
      const asset =
        entity.get<AsepriteAssetComponent>('aseprite-asset') || entity.get<SpriteAssetComponent>('sprite-asset');
      const position = entity.get<PositionComponent>('position');
      const sprite = entity.get<SpriteComponent>('sprite');
      const body = entity.get<BodyComponent>('body');

      if (position && !sprite.sprite && asset.loaded) {
        sprite.sprite = scene.physics.add.sprite(
          position.x,
          position.y,
          asset instanceof AsepriteAssetComponent ? undefined : asset.key,
        );
        sprite.sprite.setOrigin(
          body.pivotX ? body.pivotX / body.width : 0,
          body.pivotY ? body.pivotY / body.height : 0,
        );

        if (asset instanceof AsepriteAssetComponent) {
          sprite.sprite.anims.createFromAseprite(asset.key);
        }

        sprite.sprite.setInteractive();
        sprite.sprite.on('pointerdown', () => {
          if (entity.id !== scene.room.sessionId) {
            container.query(['target-highlight']).forEach((entity) => {
              entity.removeComponent('target-highlight');
            });
            const target = new TargetComponent();
            target.target = entity.id;
            container.getEntity(scene.room.sessionId)?.addComponent(target);
          }
        });
      }

      if (sprite.sprite) {
        if (entity.has('tag-object')) {
          sprite.sprite.depth = sprite.sprite.y + sprite.sprite.height;
        } else {
          sprite.sprite.depth = sprite.sprite.y + sprite.sprite.height / 2;
        }
      }
    });
    container.query(['tag-object', 'sprite']).forEach((entity) => {
      const sprite = entity.get<SpriteComponent>('sprite');
      const players = container.query(['tag-player', 'sprite']);

      if (!sprite.sprite) {
        return;
      }

      if (
        players.some((player) => {
          const pSprite = player.get<SpriteComponent>('sprite');

          if (!pSprite.sprite) return false;

          return (
            collide(
              {
                x: pSprite.sprite.x - (pSprite.sprite.width * pSprite.sprite.originX) / 2,
                y: pSprite.sprite.y - pSprite.sprite.height * pSprite.sprite.originY,
                width: pSprite.sprite.width / 2,
                height: pSprite.sprite.height,
              },
              {
                x: sprite.sprite.x,
                y: sprite.sprite.y,
                width: sprite.sprite.width,
                height: sprite.sprite.height,
              },
            ) && pSprite.sprite.depth < sprite.sprite.depth
          );
        })
      ) {
        sprite.sprite.setAlpha(0.5, 0.5, 0.5, 0.5);
      } else {
        sprite.sprite.setAlpha(1, 1, 1, 1);
      }
    });
  }
}
