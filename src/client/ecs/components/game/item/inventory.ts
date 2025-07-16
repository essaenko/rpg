import { NetworkComponent } from '@client/core/ecs/component/network-component';

import type { Stack } from '@shared/schemas/game/item/core/item';

export class Inventory extends NetworkComponent {
  public items: Stack[] = [];
  public slots: number = 25;
  public gold: number = 0;

  constructor() {
    super('inventory');
  }
}
