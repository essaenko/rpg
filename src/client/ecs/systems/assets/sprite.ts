import { System } from '@client/core/ecs/system';
import { ECSContainer } from '@client/core/ecs';
import { PositionComponent } from '@client/ecs/components/physics/position';
import { SpriteComponent } from '@client/ecs/components/game/asset/sprite';
import { BodyComponent } from '@client/ecs/components/physics/body';
import { WorldScene } from '@client/core/scene/world-scene';
import { TargetComponent } from '@client/ecs/components/game/combat/target';
import { collide } from '@server/core/helpers/map';
import { AppearanceComponent } from '@client/ecs/components/game/appearance';

export class SpriteSystem extends System {
  constructor() {
    super('sprite');
  }

  onUpdate(scene: WorldScene, container: ECSContainer): void {
    container.query(['tag-object', 'sprite']).forEach((entity) => {
      const sprite = entity.get<SpriteComponent>('sprite');
      const players = container.query(['tag-player', 'appearance']);

      if (!sprite.sprite) {
        return;
      }

      sprite.sprite.depth = sprite.sprite.y + sprite.sprite.height - 16;

      if (
        players.some((player) => {
          const pSprite = player.get<AppearanceComponent>('appearance');

          if (!pSprite.sprites) return false;

          return (
            collide(
              {
                x: pSprite.sprites.x - (pSprite.sprites.width * pSprite.sprites.originX) / 2,
                y: pSprite.sprites.y - pSprite.sprites.height * pSprite.sprites.originY,
                width: pSprite.sprites.width / 2,
                height: pSprite.sprites.height,
              },
              {
                x: sprite.sprite.x,
                y: sprite.sprite.y,
                width: sprite.sprite.width,
                height: sprite.sprite.height,
              },
            ) && pSprite.sprites.depth < sprite.sprite.depth
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
