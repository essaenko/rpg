import { Class, GearType, WeaponType } from '@shared/types';

export const CLASS_AWAILABLE_GEAR_TYPES = {
  [Class.Warrior]: {
    gear: [GearType.Plate],
    weapon: [
      WeaponType.Sword,
      WeaponType.HeavySword,
      WeaponType.Mace,
      WeaponType.HeavyMace,
      WeaponType.Axe,
      WeaponType.HeavyAxe,
      WeaponType.Shield,
      WeaponType.HeavyShield,
    ],
  },
  [Class.Mage]: {
    gear: [GearType.Cloth],
    weapon: [WeaponType.Staff, WeaponType.Dagger, WeaponType.Wand],
  },
  [Class.Hunter]: {
    gear: [GearType.Chain],
    weapon: [WeaponType.Dagger, WeaponType.Sword, WeaponType.Bow, WeaponType.LongBow, WeaponType.CrossBow],
  },
  [Class.Sage]: {
    gear: [GearType.Cloth, GearType.Leather],
    weapon: [WeaponType.Dagger, WeaponType.Staff, WeaponType.Wand, WeaponType.Mace, WeaponType.Shield],
  },
};

export type GearSpellTierType = 'Tier1' | 'Tier2' | 'Tier3' | 'Tier4';

export const GearSpellTier: Record<GearSpellTierType, GearSpellTierType> = {
  Tier1: 'Tier1',
  Tier2: 'Tier2',
  Tier3: 'Tier3',
  Tier4: 'Tier4',
};
