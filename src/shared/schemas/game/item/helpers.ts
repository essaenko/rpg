import { EquipSlot } from '@shared/types';

export const isEquipItemSlot = (slot: unknown): slot is EquipSlot => {
  return typeof slot === 'number' && slot in EquipSlot;
};
