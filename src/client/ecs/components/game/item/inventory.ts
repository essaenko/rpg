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

  observe(schema: InventorySchema): void {
    schema.items.onAdd((item) => {
      this.items.push(item);
    });
    schema.items.onRemove((item) => {
      this.items.splice(this.items.indexOf(item, 1));
    });

    schema.onChange(() => {
      this.slots = schema.slots;
    });
  }
}
