import { Item } from './core/item';
import { Chest } from '@shared/schemas/game/item/gear/chest';
import { Head } from '@shared/schemas/game/item/gear/head';
import { Shoulder } from '@shared/schemas/game/item/gear/shoulder';
import { Boots } from '@shared/schemas/game/item/gear/boots';
import { Ring } from '@shared/schemas/game/item/gear/ring';
import { Trinket } from '@shared/schemas/game/item/gear/trinket';
import { Weapon } from '@shared/schemas/game/item/weapon/weapon';

export const map = {
  item: Item,
  head: Head,
  chest: Chest,
  shoulder: Shoulder,
  boots: Boots,
  ring: Ring,
  trinket: Trinket,
  weapon: Weapon,
} as const;

export const isItemFactoryName = (type: unknown): type is keyof typeof map => {
  return typeof type === 'string' && type in map;
};

export class ItemFactory {
  static instantiate(save: unknown): Item | undefined {
    if (typeof save === 'object' && 'factory' in save && isItemFactoryName(save.factory)) {
      const factory = map[save.factory];
      const item = new factory();

      if (item.validateSave(save)) {
        // @ts-ignore
        item.init(save);
      }

      return item;
    }
  }
}
