import { Scene } from '@server/core/scene/scene';
import { Inventory } from '@server/ecs/components/game/item/inventory';
import { Loot } from '@server/ecs/components/game/item/loot';
import { ECSContainer } from '@shared/ecs';
import { System } from '@shared/ecs/system';
import { TransportEventTypes } from '@shared/types';
import { Client } from 'colyseus';

export class LootSystem extends System {
  constructor() {
    super('loot');
  }

  handleMessage(client: Client, type: TransportEventTypes, message: any, container: ECSContainer): void {
    if (
      type === TransportEventTypes.PickItem &&
      Array.isArray(message) &&
      typeof message[0] === 'string' &&
      message[0].length === 9
    ) {
      const player = container.getEntity(client.sessionId);
      const loot = player?.get<Loot>('loot');
      const inventory = player?.get<Inventory>('inventory');
      const itemID = message[0];

      if (player && loot && itemID && loot.items.some(({ id }) => id === itemID) && inventory) {
        const item = loot.items.find(({ id }) => id === itemID);
        inventory.addItem(item);
        loot.items.splice(loot.items.indexOf(item), 1);

        if (loot.items.length === 0) {
          player.removeComponent(loot);
        }
      }
    }
  }
  onUpdate(delta: number, container: ECSContainer, scene: Scene): void {}
}
