import { Spell } from '@server/mechanics/spells/spell';
import { Entity } from '@shared/ecs/entity';
import { MDBClient } from '@server/mongodb';
import { rollLoot } from '@server/utils/game/roll';
import { Loot } from '@server/ecs/components/game/item/loot';
import { nanoid } from 'nanoid';
import { Item, Stack } from '@shared/schemas/game/item/core/item';
import { isItemFactoryName, map } from '@shared/schemas/game/item/map';
import { InteractableObject } from '@server/ecs/components/game/mechanics/interactable-object';
import { entity } from '@colyseus/schema';

@entity
export abstract class LootingBase extends Spell {
  async handleLootTable(player: Entity, object: Entity) {
    const interaction = object.get<InteractableObject>('interactable-object');

    if (interaction && !interaction.locked) {
      interaction.locked = true;
      interaction.releaseAt = interaction.lockDuration;
      const lootTable = await MDBClient.instance().readLootTable(interaction.loot);
      if (lootTable) {
        const items = rollLoot(lootTable.items, lootTable.count).filter((id) => MDBClient.instance().itemExists(id));

        if (items.length) {
          const loot = new Loot();
          loot.id = nanoid(9);
          loot.items.push(
            ...(await Promise.all(
              items
                .map(async (id): Promise<Stack | undefined> => {
                  const save = await MDBClient.instance().readItem(id);
                  const type = save?.factory;

                  if (save && isItemFactoryName(type)) {
                    const item = new map[type]();
                    item.init(save);

                    return new Stack(item, save.amount ?? 1);
                  }
                })
                .filter((v) => !!v),
            )),
          );
          player.add(loot);
        }
      }
    }
  }
}
