import { Room, getStateCallbacks } from 'colyseus.js';
import { System } from '@client/core/ecs/system';
import { ECSContainer } from '@client/core/ecs';
import type { SceneState } from '@shared/schemas/scene';
import type { EntitySchema } from '@shared/ecs/entity';
import { WorldScene } from '@client/core/scene/world-scene';
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

  onUpdate(scene: WorldScene, container: ECSContainer): void {}

  observe(room: Room<SceneState>, container: ECSContainer) {
    this._room = room;
    const $ = getStateCallbacks(room);
    $(room.state).entities.onAdd((entity: EntitySchema) => {
      this.onAddEntity(entity, container);
    });
    $(room.state).entities.onRemove((entity: EntitySchema) => {
      container.removeEntity(container.getEntity(entity.id));
    });
  }

  onAddEntity(eSchema: EntitySchema, container: ECSContainer) {
    const $ = getStateCallbacks(this._room);
    const entity = new NetworkEntity(eSchema.id, $);

    entity.observe(eSchema);

    container.addEntity(entity);
  }
}
