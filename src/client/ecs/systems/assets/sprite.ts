import { System } from '@client/core/ecs/system';
import { ECSContainer } from '@client/core/ecs';
import { Sprite } from '@client/ecs/components/game/visual/sprite';
import { WorldScene } from '@client/core/scene/world-scene';
import { collide } from '@server/core/helpers/map';
import { Appearance } from '@client/ecs/components/game/visual/appearance';
import { Cursors } from '@client/utils/types';

export class SpriteSystem extends System {
  constructor() {
    super('sprite');
  }

  onUpdate(scene: WorldScene, container: ECSContainer): void {
    container.query(['tag-object', 'sprite']).forEach((entity) => {
      const sprite = entity.get<Sprite>('sprite');
      const players = container.query(['tag-player', 'appearance']);

      if (!sprite.sprite) {
        return;
      }

      if (sprite.sprite?.input && !sprite.sprite.input.cursor) {
        sprite.sprite.input.cursor = `url(${Cursors.Loot}), pointer`;
      }

      sprite.sprite.depth = sprite.sprite.y + sprite.sprite.height / 2;

      if (entity.has('transparent')) {
        if (
          players.some((player) => {
            const pSprite = player.get<Appearance>('appearance');

            if (!pSprite.sprites) return false;

            return (
              collide(
                {
                  x: pSprite.sprites.x - (pSprite.sprites.width * pSprite.sprites.originX) / 2,
                  y: pSprite.sprites.y - (pSprite.sprites.height * pSprite.sprites.originY) / 2,
                  width: pSprite.sprites.width / 2,
                  height: pSprite.sprites.height,
                },
                {
                  x: sprite.sprite.x - sprite.sprite.width * sprite.sprite.originX,
                  y: sprite.sprite.y - sprite.sprite.height * sprite.sprite.originY,
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
      }
    });
  }
}
