import { Scene } from '@server/core/scene/scene';
import { InteractableObject } from '@server/ecs/components/game/mechanics/interactable-object';
import { Loot } from '@server/ecs/components/game/item/loot';
import { MDBClient } from '@server/mongodb';
import { rollLoot } from '@server/utils/game/roll';
import { ECSContainer } from '@shared/ecs';
import { System } from '@shared/ecs/system';
import { Item } from '@shared/schemas/game/item/item';
import { isItemFactoryName, map } from '@shared/schemas/game/item/map';
import { InteractionTypes, TransportEventTypes } from '@shared/types';
import { Client } from 'colyseus';
import { nanoid } from 'nanoid';
import { Channeling } from '@server/ecs/components/game/spell/channeling';
import { CastRequest } from '@server/ecs/components/game/spell/cast-request';
import { Gather } from '@server/mechanics/spells/common/gather';
import { Spells } from '@shared/utils/spells';
import e from 'express';

export class InteractionSystem extends System {
  constructor() {
    super('interaction');
  }

  async handleMessage(client: Client, type: TransportEventTypes, message: any, container: ECSContainer): Promise<void> {
    if (type === TransportEventTypes.Interaction) {
      if (Array.isArray(message) && typeof message[0] === 'string' && message[0].length === 9) {
        const player = container.getEntity(client.sessionId);
        const entity = container.getEntity(message[0]);
        const interaction = entity?.get<InteractableObject>('interactable-object');

        if (!interaction.locked) {
          const cr = new CastRequest();

          switch (interaction.action) {
            case InteractionTypes.Loot:
              cr.init({
                spell: Spells.Loot,
                target: entity,
              });
              break;
            case InteractionTypes.Gather:
              cr.init({
                spell: Spells.Gather,
                target: entity,
              });
              break;
          }

          if (cr.target && cr.spell) {
            player.add(cr);
          }
        }
      }
    }
  }
  onUpdate(delta: number, container: ECSContainer, scene: Scene): void {
    for (const obj of container.query(['interactable-object'])) {
      const interaction = obj.get<InteractableObject>('interactable-object');
      if (interaction.locked) {
        interaction.releaseAt = Math.max(0, interaction.releaseAt - delta);

        if (interaction.releaseAt === 0) {
          interaction.locked = false;
        }
      }
    }
  }
}
