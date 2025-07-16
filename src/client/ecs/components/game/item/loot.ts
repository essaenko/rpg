import { NetworkComponent } from '@client/core/ecs/component/network-component';
import type { Stack } from '@shared/schemas/game/item/core/item';

export class Loot extends NetworkComponent {
  constructor() {
    super('loot');
  }

  public id: string = null;
  public items: Stack[] = [];
}
