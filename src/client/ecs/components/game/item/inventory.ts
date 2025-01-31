import { NetworkComponent } from '@client/core/ecs/component/network-component';
import { Schema } from '@colyseus/schema';

import type { Stack } from '@shared/schemas/game/item/item';
import type { Inventory as InventorySchema } from '@server/ecs/components/game/item/inventory';

export class Inventory extends NetworkComponent {
  public items: Stack[] = [];
  public slots: number = 25;

  constructor() {
    super('inventory');
  }
}
