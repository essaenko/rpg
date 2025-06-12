import { EquipSlot, WeaponHand, WeaponType } from '@shared/types';

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

export type EquipItemSave = ItemSave & {
  slot: EquipSlot;
  effect: string;
};

export type WeaponSave = EquipItemSave & {
  attackMin: number;
  attackMax: number;
  speed: number;
  hand: WeaponHand;
  type: WeaponType;
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

export const isWeapon = (config: unknown): config is WeaponSave => {
  return isEquipItem(config) && 'type' in config && 'hand' in config;
};

export const isEquipItem = (config: unknown): config is EquipItemSave => {
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
