import { Class } from '@shared/types';
import { Gear } from '@server/ecs/components/game/item/gear';

export type MainStats = {
  strength: number;
  agility: number;
  intellect: number;
  stamina: number;
};

export type SecondaryStats = {
  attackPower: number;
  spellPower: number;
  crit: number;
  armor: number;
  resistance: number;
  parry: number;
  dodge: number;
  block: number;
  speed: number;
};

export const DEFAULT_CLASS_STATS_GROWTH = {
  [Class.Warrior]: {
    strength: 2,
    agility: 1,
    intellect: 0,
    stamina: 2,
  },
  [Class.Mage]: {
    strength: 0,
    agility: 1,
    intellect: 3,
    stamina: 1,
  },
  [Class.Sage]: {
    strength: 0,
    agility: 1,
    intellect: 2,
    stamina: 2,
  },
  [Class.Hunter]: {
    strength: 1,
    agility: 2,
    intellect: 1,
    stamina: 1,
  },
};

export const DEFAULT_CLASS_STATS = {
  [Class.Warrior]: {
    main: {
      strength: 8,
      agility: 5,
      intellect: 2,
      stamina: 7,
    },
    secondary: {
      attackPower: 12,
      spellPower: 1,
      crit: 2,
      armor: 10,
      resistance: 2,
      parry: 5,
      dodge: 3,
      block: 6,
      speed: 1.0,
    },
  },
  [Class.Sage]: {
    main: {
      strength: 3,
      agility: 4,
      intellect: 7,
      stamina: 4,
    },
    secondary: {
      attackPower: 4,
      spellPower: 10,
      crit: 2,
      armor: 4,
      resistance: 5,
      parry: 1,
      dodge: 3,
      block: 2,
      speed: 1.1,
    },
  },
  [Class.Mage]: {
    main: {
      strength: 2,
      agility: 3,
      intellect: 9,
      stamina: 3,
    },
    secondary: {
      attackPower: 3,
      spellPower: 14,
      crit: 3,
      armor: 2,
      resistance: 6,
      parry: 0,
      dodge: 2,
      block: 0,
      speed: 1.2,
    },
  },
  [Class.Hunter]: {
    main: {
      strength: 4,
      agility: 8,
      intellect: 3,
      stamina: 5,
    },
    secondary: {
      attackPower: 8,
      spellPower: 2,
      crit: 5,
      armor: 5,
      resistance: 3,
      parry: 3,
      dodge: 6,
      block: 2,
      speed: 1.2,
    },
  },
};
export const calculateMainStats = (cl: Class, level: number, gear: Gear): MainStats => {
  const stats = [
    gear.mainHand,
    gear.offHand,
    gear.chest,
    gear.boots,
    gear.shoulder,
    gear.head,
    gear.ring,
    gear.trinket,
  ].reduce(
    (acc, item) => {
      acc.stamina += item?.stats?.stamina ?? 0;
      acc.strength += item?.stats?.strength ?? 0;
      acc.agility += item?.stats?.agility ?? 0;
      acc.intellect += item?.stats?.intellect ?? 0;

      return acc;
    },
    {
      stamina: 0,
      strength: 0,
      agility: 0,
      intellect: 0,
    },
  );
  return {
    stamina:
      DEFAULT_CLASS_STATS[cl].main.stamina + (level - 1) * DEFAULT_CLASS_STATS_GROWTH[cl].stamina + stats.stamina,
    strength:
      DEFAULT_CLASS_STATS[cl].main.strength + (level - 1) * DEFAULT_CLASS_STATS_GROWTH[cl].strength + stats.strength,
    intellect:
      DEFAULT_CLASS_STATS[cl].main.intellect + (level - 1) * DEFAULT_CLASS_STATS_GROWTH[cl].intellect + stats.intellect,
    agility:
      DEFAULT_CLASS_STATS[cl].main.agility + (level - 1) * DEFAULT_CLASS_STATS_GROWTH[cl].agility + stats.agility,
  };
};

export const calculateSecondaryStats = (cl: Class, level: number, gear: Gear): SecondaryStats => {
  const main = calculateMainStats(cl, level, gear);

  return {
    attackPower: DEFAULT_CLASS_STATS[cl].secondary.attackPower + main.strength * 2,
    spellPower: DEFAULT_CLASS_STATS[cl].secondary.spellPower + main.intellect * 2,
    crit: DEFAULT_CLASS_STATS[cl].secondary.crit + (main.agility * 0.5 + main.intellect * 0.5),
    armor: Math.round(
      DEFAULT_CLASS_STATS[cl].secondary.armor +
        50 * ((main.strength + main.stamina) / (main.strength + main.stamina + 100)),
    ),
    resistance: Math.round(
      DEFAULT_CLASS_STATS[cl].secondary.resistance +
        40 * ((main.intellect + main.stamina) / (main.intellect + main.stamina + 60)),
    ),
    parry: Math.round(DEFAULT_CLASS_STATS[cl].secondary.parry + (main.strength * 0.3 + main.agility * 0.4)),
    dodge: DEFAULT_CLASS_STATS[cl].secondary.dodge + main.agility,
    block:
      DEFAULT_CLASS_STATS[cl].secondary.block +
      20 * ((main.strength + main.stamina) / (main.strength + main.stamina + 80)),
    speed: DEFAULT_CLASS_STATS[cl].secondary.speed + (0.6 * main.agility) / (main.agility + 40),
  };
};
