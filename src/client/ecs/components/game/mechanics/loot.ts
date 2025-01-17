import { NetworkComponent } from '@client/core/ecs/component/network-component';

import type { Loot as LootSchema } from '@server/ecs/components/game/mechanics/loot';
import type { Item } from '@shared/schemas/game/item/item';

export class Loot extends NetworkComponent {
  observe(schema: LootSchema): void {
    schema.onChange(() => {
      this.id = schema.id;
    });

    schema.items.onAdd((item) => {
      this.items.push(item);
    }, false);

    schema.items.onRemove((item) => {
      this.items.splice(this.items.indexOf(item), 1);
    });
  }
  constructor() {
    super('loot');
  }

  public id: string = null;
  public items: Item[] = [];
}
