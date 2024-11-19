import { EquipItem } from '@shared/schemas/game/item/equip-item';
import { Weapon } from '@shared/schemas/game/item/weapon';
import { RegularItem } from '@shared/schemas/game/item/regular-item';

export const map = {
  'equip-item': EquipItem,
  'regular-item': RegularItem,
  weapon: Weapon,
} as const;

export const isItemType = (type: unknown): type is keyof typeof map => {
  return typeof type === 'string' && type in map;
};
