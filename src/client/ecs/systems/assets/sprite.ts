import { System } from '@client/core/ecs/system';
import { ECSContainer } from '@client/core/ecs';
import { Sprite } from '@client/ecs/components/game/visual/sprite';
import { WorldScene } from '@client/core/scene/world-scene';
import { collide } from '@server/core/helpers/map';
import { Appearance } from '@client/ecs/components/game/visual/appearance';
import { Cursors } from '@client/utils/types';
import { Entity } from '@client/core/ecs/entity/entity';
import { MapObject } from '@client/ecs/components/game/tag/mapObject';
import { Position } from '@client/ecs/components/physics/position';
import { isMapKey, maps } from '@shared/maps/mapping';
import { Animation } from '@client/ecs/components/game/visual/animation';

export class SpriteSystem extends System {
  constructor() {
    super('sprite');
  }

  onUpdate(scene: WorldScene, container: ECSContainer): void {
    for (const it of container.query(['tag-object'])) {
      if (!it.has('sprite') && it instanceof Entity) {
        const location = scene.name;
        const object = it.get<MapObject>('tag-object');
        const position = it.get<Position>('position');

        if (isMapKey(location)) {
          const m = maps[location];
          const set = m.tilesets.find((set) => set.name === object.type);
          if (set) {
            const sprite = scene.physics.add.sprite(position.x, position.y, object.type, object.gid - set.firstgid);
            sprite.setPipeline('Light2D');
            sprite.setOrigin(0.5, 0.5);
            sprite.depth = sprite.y + sprite.height / 2;
            const animKey = `${object.type}-animation-${object.gid}`;

            if (scene.anims.exists(animKey)) {
              const animComponent = new Animation();
              animComponent.key = animKey;

              it.add(animComponent);
            }
            const sComponent = new Sprite();
            sComponent.sprite = sprite;

            it.add(sComponent);
          }
        }
      } else {
        const sprite = it.get<Sprite>('sprite');
        const players = container.query(['tag-player', 'appearance']);

        if (!sprite.sprite) {
          return;
        }

        if (sprite.sprite?.input && !sprite.sprite.input.cursor) {
          sprite.sprite.input.cursor = `url(${Cursors.Loot}), pointer`;
        }

        sprite.sprite.depth = sprite.sprite.y + sprite.sprite.height / 2;

        if (it.has('transparent')) {
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
      }
    }
  }
}
