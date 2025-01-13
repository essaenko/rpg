import { System } from '@shared/ecs/system';
import { Client } from '@colyseus/core';
import { TransportEventTypes } from '@shared/types';
import { ECSContainer } from '@shared/ecs';
import { Scene } from '@server/core/scene/scene';
import { ChangeHealth } from '@server/ecs/components/game/stats/health/change-health';
import { Heal } from '@server/ecs/components/game/spell/heal';

export class HealSystem extends System {
  constructor() {
    super('heal');
  }

  handleMessage(client: Client, type: TransportEventTypes, message: any, container: ECSContainer): void {}

  onUpdate(delta: number, container: ECSContainer, scene: Scene): void {
    container.query(['heal']).forEach((entity) => {
      let health = entity.get<ChangeHealth>('change-health');

      if (!health) {
        health = new ChangeHealth();
        entity.addComponent(health);
      }

      health.value += entity.get<Heal>('heal').value ?? 0;
      entity.removeComponent('heal');
    });
  }
}
