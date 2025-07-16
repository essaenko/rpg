import { GearSlot, WeaponHand, WeaponType } from '@shared/types';
import { MainStats } from '@shared/utils/stats';
import { GearItem } from '@shared/schemas/game/item/core/gear-item';
import { Spells } from '@shared/utils/spells';

export type EntitySave = { id: string; components: Record<string, any>[] };

export const isEntitySave = (save: unknown): save is EntitySave => {
  return typeof save === 'object' && save != null && 'components' in save;
};

export type QuestSave = {
  id: string;
  name: string;
  short_description: string;
  description: string;
  rewards: [];
  requirements?: [];
  conditions?: [];
};

export type ItemSave = {
  id: string;
  name: string;
  description: string;
  cost: number;
  factory: string;
  stackable?: boolean;
  maxStack?: number;
  amount?: number;
};

export type ChestSave = GearItem & {
  save?: Spells[];
  dodge?: Spells[];
};

export type FlaskSave = GearItem & {
  flask?: Spells;
};

export type FoodSave = GearItem & {
  food?: Spells;
};

export type GearItemSave = ItemSave & {
  slot: GearSlot;
  effect: string;
  stats: MainStats;
};

export type CharacterGearSave = {
  name: 'gear';
  head: {
    id: string;
  };
  chest: {
    id: string;
    dodge?: Spells;
    save?: Spells;
  };
  shoulder: {
    id: string;
  };
  boots: {
    id: string;
  };
  mainHand: {
    id: string;
    main?: Spells;
    secondary?: Spells;
    buff?: Spells;
    ultimate?: Spells;
  };
  offHand: {
    id: string;
    secondary?: Spells;
    buff?: Spells;
  };
  ring: {
    id: string;
  };
  trinket: {
    id: string;
  };
  food: {
    id: string;
    food?: Spells;
  };
  flask: {
    id: string;
    flask?: Spells;
  };
};

export type WeaponSave = GearItemSave & {
  attackMin: number;
  attackMax: number;
  speed: number;
  hand: WeaponHand;
  type: WeaponType;

  main?: Spells[];
  secondary?: Spells[];
  buff?: Spells[];
  ultimate?: Spells[];
};

export type LootTableItem = {
  item: string;
  chance: number;
};

export type LootTableSave = {
  id: string;
  items: LootTableItem[];
  count: number;
};

export const isChest = (config: unknown): config is ChestSave => {
  return isEquipItem(config);
};

export const isWeapon = (config: unknown): config is WeaponSave => {
  return isEquipItem(config) && 'type' in config && 'hand' in config;
};

export const isEquipItem = (config: unknown): config is GearItemSave => {
  return isItem(config) && 'slot' in config;
};

export const isItem = (config: unknown): config is ItemSave => {
  return config && typeof config === 'object' && 'name' in config && 'description' in config;
};

export const isQuest = (config: unknown): config is QuestSave => {
  return config && typeof config === 'object' && 'rewards' in config && 'description' in config;
};

export const isLootTable = (config: unknown): config is LootTableSave => {
  return config && typeof config === 'object' && 'items' in config && 'id' in config;
};
