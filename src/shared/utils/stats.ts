import { Class } from '@shared/types';
import { DEFAULT_CLASS_STATS, DEFAULT_CLASS_STATS_GROWTH } from '@shared/utils/const';

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

export const calculateMainStats = (cl: Class, level: number): MainStats => {
  return {
    stamina: DEFAULT_CLASS_STATS[cl].main.stamina + (level - 1) * DEFAULT_CLASS_STATS_GROWTH[cl].stamina,
    strength: DEFAULT_CLASS_STATS[cl].main.strength + (level - 1) * DEFAULT_CLASS_STATS_GROWTH[cl].strength,
    intellect: DEFAULT_CLASS_STATS[cl].main.intellect + (level - 1) * DEFAULT_CLASS_STATS_GROWTH[cl].intellect,
    agility: DEFAULT_CLASS_STATS[cl].main.agility + (level - 1) * DEFAULT_CLASS_STATS_GROWTH[cl].agility,
  };
};

export const calculateSecondaryStats = (cl: Class, level: number): SecondaryStats => {
  const main = calculateMainStats(cl, level);

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
    block: DEFAULT_CLASS_STATS[cl].secondary.block + (main.strength * 0.5 + main.stamina * 0.5),
    speed: DEFAULT_CLASS_STATS[cl].secondary.speed + (0.6 * main.agility) / (main.agility + 40),
  };
};
