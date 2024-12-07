import { System } from '@shared/ecs/system';
import { Client } from '@colyseus/core';
import { TransportEventTypes } from '@shared/types';
import { ECSContainer } from '@shared/ecs';
import { Scene } from '@server/core/scene/scene';
import { HotComponent } from '@server/ecs/components/game/spells/hot';
import { HealComponent } from '@server/ecs/components/game/spells/heal';
import { DamageComponent } from '@server/ecs/components/game/spells/damage';

export class DotSystem extends System {
  constructor() {
    super('dot');
  }

  handleMessage(client: Client, type: TransportEventTypes, message: any, container: ECSContainer): void {}

  onUpdate(delta: number, container: ECSContainer, scene: Scene): void {
    container.query(['dot']).forEach((entity) => {
      const dot = entity.get<HotComponent>('dot');
      dot.nextTick = Math.max(0, dot.nextTick - delta);

      if (dot.nextTick === 0) {
        dot.nextTick = dot.interval;

        const damage = new DamageComponent();
        damage.value = dot.amount;

        entity.addComponent(damage);
      }

      dot.duration = Math.max(0, dot.duration - delta);
      if (dot.duration === 0) {
        entity.removeComponent(dot);
      }
    });
  }
}
