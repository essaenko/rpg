import { Schema, type } from '@colyseus/schema';

import { MainStats as MainStatsType, SecondaryStats as SecondaryStatsType } from '@shared/utils/stats';

export class MainStats extends Schema implements MainStatsType {
  @type('number') agility: number;
  @type('number') intellect: number;
  @type('number') stamina: number;
  @type('number') strength: number;

  constructor(stats: MainStatsType) {
    super();

    this.stamina = stats.stamina;
    this.strength = stats.strength;
    this.intellect = stats.intellect;
    this.agility = stats.agility;
  }
}

export class SecondaryStats extends Schema implements SecondaryStatsType {
  @type('number') armor: number;
  @type('number') attackPower: number;
  @type('number') block: number;
  @type('number') crit: number;
  @type('number') dodge: number;
  @type('number') parry: number;
  @type('number') resistance: number;
  @type('number') speed: number;
  @type('number') spellPower: number;
}
