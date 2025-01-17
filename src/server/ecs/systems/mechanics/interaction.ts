import { Scene } from '@server/core/scene/scene';
import { InteractableObject } from '@server/ecs/components/game/mechanics/interactable-object';
import { Loot } from '@server/ecs/components/game/mechanics/loot';
import { MDBClient } from '@server/mongodb';
import { rollLoot } from '@server/utils/game/roll';
import { ECSContainer } from '@shared/ecs';
import { System } from '@shared/ecs/system';
import { Item } from '@shared/schemas/game/item/item';
import { isItemFactoryName, map } from '@shared/schemas/game/item/map';
import { InteractionTypes, TransportEventTypes } from '@shared/types';
import { Client } from 'colyseus';
import { nanoid } from 'nanoid';

export class InteractionSystem extends System {
  constructor() {
    super('interaction');
  }

  async handleLootInteraction(client: Client, container: ECSContainer, interaction: InteractableObject) {
    if (interaction && !interaction.locked) {
      interaction.locked = true;
      const lootTable = await MDBClient.instance().readLootTable(interaction.loot);
      const player = container.getEntity(client.sessionId);
      if (lootTable && player) {
        const items = rollLoot(lootTable.items, lootTable.count).filter((id) => MDBClient.instance().itemExists(id));

        if (items.length) {
          const loot = new Loot();
          loot.id = nanoid(9);
          loot.items.push(
            ...(await Promise.all(
              items
                .map(async (id): Promise<Item | undefined> => {
                  const save = await MDBClient.instance().readItem(id);
                  const type = save?.factory;

                  if (save && isItemFactoryName(type)) {
                    const item = new map[type]();
                    item.init(save);

                    return item;
                  }
                })
                .filter((v) => !!v),
            )),
          );
          player.addComponent(loot);
        }
      }
    }
  }

  async handleMessage(client: Client, type: TransportEventTypes, message: any, container: ECSContainer): Promise<void> {
    if (type === TransportEventTypes.Interaction) {
      if (Array.isArray(message) && typeof message[0] === 'string' && message[0].length === 9) {
        const entity = container.getEntity(message[0]);
        const interaction = entity?.get<InteractableObject>('interactable-object');

        switch (interaction.action) {
          case InteractionTypes.Loot:
            this.handleLootInteraction(client, container, interaction);
            break;
        }
      }
    }
  }
  onUpdate(delta: number, container: ECSContainer, scene: Scene): void {
    // throw new Error('Method not implemented.');
  }
}
