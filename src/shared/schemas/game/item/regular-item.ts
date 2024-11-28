import { Item } from '@shared/schemas/game/item/item';

export class RegularItem extends Item {
  factory = 'regular-item';
  init(state: Record<string, any>): void {}
}
