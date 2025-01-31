import { NetworkComponent } from '@client/core/ecs/component/network-component';
import type { Item } from '@shared/schemas/game/item/item';

export class Loot extends NetworkComponent {
  constructor() {
    super('loot');
  }

  public id: string = null;
  public items: Item[] = [];
}
