import { System } from '@shared/ecs/system';
import { TransportEventTypes } from '@shared/types';
import { Client } from '@colyseus/core';
import { ECSContainer } from '@shared/ecs';
import { Scene } from '@server/core/scene/scene';
import { Gear } from '@server/ecs/components/game/item/gear';

export class GearSystem extends System {
  constructor() {
    super('gear');
  }

  handleMessage(client: Client, type: TransportEventTypes, message: any, container: ECSContainer) {}

  onUpdate(delta: number, container: ECSContainer, scene: Scene) {
    for (const it of container.query(['gear']).filter((it) => it.get<Gear>('gear').dirty)) {
      const gear = it.get<Gear>('gear');
      if (!gear.processed) {
        gear.processed = true;
      } else {
        gear.processed = false;
        gear.dirty = false;
      }
    }
  }
}
