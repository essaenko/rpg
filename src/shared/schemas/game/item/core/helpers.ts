import { GearSlot } from '@shared/types';

export const isGearItemSlot = (slot: unknown): slot is GearSlot => {
  return typeof slot === 'number' && slot in GearSlot;
};
