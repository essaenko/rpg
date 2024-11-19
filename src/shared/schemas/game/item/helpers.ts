import type { EquipComponent } from '@server/ecs/components/game/item/equip';
import { EquipSlot } from '@shared/types';

export const isEquipItemSlot = (slot: unknown): slot is keyof EquipComponent => {
  return typeof slot === 'string' && slot in EquipSlot;
};
