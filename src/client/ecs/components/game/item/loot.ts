import { NetworkComponent } from '@client/core/ecs/component/network-component';

import type { Loot as LootSchema } from '@server/ecs/components/game/item/loot';
import type { Item } from '@shared/schemas/game/item/item';

export class Loot extends NetworkComponent {
  observe(schema: LootSchema): void {
    schema.onChange(() => {
      this.id = schema.id;
    });

    schema.items.onAdd((item) => {
      this.items.push(item);
      this.emit('component:change');
    }, false);

    schema.items.onRemove((item) => {
      this.items.splice(this.items.indexOf(item), 1);
      this.emit('component:change');
    });
  }
  constructor() {
    super('loot');
  }

  public id: string = null;
  public items: Item[] = [];
}
