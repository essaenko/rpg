import { Spells } from '@shared/utils/spells';
import { Class } from '@shared/types';

export const QUEST_GIVER_ACTION_DISTANCE = 128;
export const INTERACTION_DISTANCE = 64;
export const AREA_OF_INTEREST_DISTANCE = 1280;

export const COMMON_SPELLS = new Set([Spells.Gather, Spells.Loot]);

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
