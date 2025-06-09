import { System } from '@shared/ecs/system';
import { Client } from '@colyseus/core';
import { TransportEventTypes } from '@shared/types';
import { ECSContainer } from '@shared/ecs';
import { Scene } from '@server/core/scene/scene';
import { Behavior } from '@server/ecs/components/game/behaviour/behavior';

export class BehaviorSystem extends System {
  constructor() {
    super('behavior');
  }
  handleMessage(client: Client, type: TransportEventTypes, message: any, container: ECSContainer): void {}

  onUpdate(delta: number, container: ECSContainer, scene: Scene): void {
    for (const entity of container.query(['behavior'])) {
      const behavior = entity.get<Behavior>('behavior');

      for (const i of behavior.behaviors) {
        i.handleEvent({
          entity,
          container,
          __blueshell: undefined,
        });
      }
    }
  }
}
