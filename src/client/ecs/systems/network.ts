import { Room, getStateCallbacks } from 'colyseus.js';
import { System } from '@client/core/ecs/system';
import { ECSContainer } from '@client/core/ecs';
import type { SceneState } from '@shared/schemas/scene';
import type { EntitySchema } from '@shared/ecs/entity';
import { WorldScene } from '@client/core/scene/world-scene';
import { Camera } from '@client/ecs/components/game/camera';
import { NetworkEntity } from '@client/core/ecs/entity/network-entity';
import { Sprite } from '@client/ecs/components/game/visual/sprite';
import { MapObject } from '@client/ecs/components/game/tag/mapObject';
import { isMapKey, maps } from '@shared/maps/mapping';
import { Position } from '@client/ecs/components/physics/position';
import { Animation } from '@client/ecs/components/game/visual/animation';
import { Entity } from '@client/core/ecs/entity/entity';

export class NetworkSystem extends System {
  constructor() {
    super('network');
  }

  private _room: Room<SceneState>;

  onUpdate(scene: WorldScene, container: ECSContainer): void {
    container.query(['tag-player']).forEach((player) => {
      if (player.id === scene.room.sessionId && !player.has('camera')) {
        const camera = new Camera();
        player.addComponent(camera);
        scene.registry.set('player', player);
      }
    });

    container.query(['tag-object']).forEach((entity) => {
      if (!entity.has('sprite') && entity instanceof Entity) {
        this.initObject(entity, scene);
      }
    });
  }

  observe(room: Room<SceneState>, container: ECSContainer) {
    this._room = room;
    const $ = getStateCallbacks(room);
    $(room.state).entities.onAdd((entity) => {
      this.onAddEntity(entity, container);
    });
    $(room.state).entities.onRemove((entity) => {
      container.removeEntity(container.getEntity(entity.id));
    });
  }

  onAddEntity(eSchema: EntitySchema, container: ECSContainer) {
    const $ = getStateCallbacks(this._room);
    const entity = new NetworkEntity(eSchema.id, $);

    entity.observe(eSchema);

    container.addEntity(entity);
  }

  initObject(entity: Entity, scene: WorldScene) {
    const location = scene.name;
    const object = entity.get<MapObject>('tag-object');
    const position = entity.get<Position>('position');

    if (isMapKey(location)) {
      const m = maps[location];
      const set = m.tilesets.find((set) => set.name === object.type);
      if (set) {
        const sprite = scene.physics.add.sprite(position.x, position.y, object.type, object.gid - set.firstgid);
        sprite.setPipeline('Light2D');
        sprite.setOrigin(0.5, 0.5);
        sprite.depth = sprite.y + sprite.height;
        const animKey = `${object.type}-animation-${object.gid}`;

        if (scene.anims.exists(animKey)) {
          const animComponent = new Animation();
          animComponent.key = animKey;

          entity.addComponent(animComponent);
        }
        const sComponent = new Sprite();
        sComponent.sprite = sprite;

        entity.addComponent(sComponent);
      }
    }
  }
}
