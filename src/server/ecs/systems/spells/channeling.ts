import { System } from '@shared/ecs/system';
import { Client } from '@colyseus/core';
import { Animation, TransportEventTypes } from '@shared/types';
import { ECSContainer } from '@shared/ecs';
import { Scene } from '@server/core/scene/scene';
import { Channeling } from '@server/ecs/components/game/spell/channeling';
import { Appearance } from '@server/ecs/components/game/appearance';
import { Cast } from '@server/ecs/components/game/spell/cast';

export class ChannelingSystem extends System {
  constructor() {
    super('channeling');
  }
  handleMessage(client: Client, type: TransportEventTypes, message: any, container: ECSContainer): void {}

  onUpdate(delta: number, container: ECSContainer, scene: Scene): void {
    for (const entity of container.query(['channeling'])) {
      const channeling = entity.get<Channeling>('channeling');
      const appearance = entity.get<Appearance>('appearance');

      if (channeling) {
        if (appearance) {
          appearance.animation = Animation.Cast;
        }
        if (channeling.remains) {
          const tickCast = channeling.process(delta * 1000);

          if (tickCast) {
            if (tickCast instanceof Cast) {
              entity.add(tickCast);
            } else {
              tickCast();
            }
          }
        }

        if (!channeling.remains) {
          entity.add(channeling.cast);
          entity.remove(channeling);

          if (appearance) {
            appearance.animation = Animation.Idle;
          }
        }
      }
    }
  }
}
