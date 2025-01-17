import { ItemSave } from '@server/mongodb/types';
import { Item } from './item';
import { EquipItem } from '@shared/schemas/game/item/equip-item';
import { Weapon } from '@shared/schemas/game/item/weapon';

export const map = {
  item: Item,
  'equip-item': EquipItem,
  weapon: Weapon,
} as const;

export const isItemFactoryName = (type: unknown): type is keyof typeof map => {
  return typeof type === 'string' && type in map;
};

export class ItemFactory {
  static instantiate(save: ItemSave): Item {
    if (isItemFactoryName(save.factory)) {
      const factory = map[save.factory];
      const item = new factory();
      item.init(save);

      return item;
    }
  }
}
