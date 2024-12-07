import { System } from '@shared/ecs/system';
import { Client } from '@colyseus/core';
import { TransportEventTypes } from '@shared/types';
import { ECSContainer } from '@shared/ecs';
import { Scene } from '@server/core/scene/scene';
import { CastRequestComponent } from '../../components/game/spells/cast-request';
import { ResourceComponent } from '@server/ecs/components/game/stats/resource/resource';
import { SpellBookComponent } from '@server/ecs/components/game/spells/spell-book';
import { CastComponent } from '@server/ecs/components/game/spells/cast';

export class CastRequestSystem extends System {
  constructor() {
    super('cast-request');
  }

  handleMessage(client: Client, type: TransportEventTypes, message: any, container: ECSContainer): void {
    if (type === TransportEventTypes.CastRequest) {
      const entity = container.getEntity(client.sessionId);
      const spell = message[0] as string;
      const target = container.getEntity(message?.[1]);

      if (entity && target && spell) {
        const castRequest = new CastRequestComponent();
        castRequest.spell = spell;
        castRequest.target = target;
        entity.addComponent(castRequest);
      }
    }
  }

  onUpdate(delta: number, container: ECSContainer, scene: Scene): void {
    container.query(['cast-request']).forEach((entity) => {
      const resource = entity.get<ResourceComponent>('resource');
      const spellBook = entity.get<SpellBookComponent>('spell-book');
      const castRequest = entity.get<CastRequestComponent>('cast-request');

      if (resource && castRequest && castRequest.target && spellBook) {
        const spell = spellBook.spells.get(castRequest.spell.toString());

        if (spell) {
          if (spell.canCast(entity, castRequest.target)) {
            const cast = new CastComponent();
            cast.target = castRequest.target;
            cast.spell = spell;
            entity.addComponent(cast);
          }
        }

        entity.removeComponent('cast-request');
      }
    });
  }
}
