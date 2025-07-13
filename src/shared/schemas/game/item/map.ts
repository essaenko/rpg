import { ItemSave } from '@server/mongodb/types';
import { Item } from './item';
import { GearItem } from '@shared/schemas/game/item/gear-item';
import { Weapon } from '@shared/schemas/game/item/weapon';

export const map = {
  item: Item,
  'gear-item': GearItem,
  weapon: Weapon,
} as const;

export const isItemFactoryName = (type: unknown): type is keyof typeof map => {
  return typeof type === 'string' && type in map;
};

export class ItemFactory {
  static instantiate(save: ItemSave): Item | undefined {
    if (isItemFactoryName(save.factory)) {
      const factory = map[save.factory];
      const item = new factory();
      item.init(save);

      return item;
    }
  }
}
