import { Component, NetworkComponent } from '@shared/ecs/component';
import { type } from '@colyseus/schema';

export class SecondaryStats extends NetworkComponent {
  constructor() {
    super('secondary-stats');
  }

  serializable = true;
  inited = false;
  appliedLevel: number = 0;
  dirty = true;

  @type('number') attackPower: number = 0;
  @type('number') spellPower: number = 0;

  @type('number') crit: number = 0;

  @type('number') armor: number = 0;
  @type('number') resistance: number = 0;

  @type('number') parry: number = 0;
  @type('number') dodge: number = 0;
  @type('number') block: number = 0;

  @type('number') speed: number = 0;

  init(state: Record<string, any>): void {
    if ('attackPower' in state) {
      this.attackPower = state.attackPower;
    }
    if ('spellPower' in state) {
      this.spellPower = state.spellPower;
    }
    if ('crit' in state) {
      this.crit = state.crit;
    }
    if ('armor' in state) {
      this.armor = state.armor;
    }
    if ('resistance' in state) {
      this.resistance = state.resistance;
    }
    if ('parry' in state) {
      this.parry = state.parry;
    }
    if ('dodge' in state) {
      this.dodge = state.dodge;
    }
    if ('block' in state) {
      this.block = state.block;
    }
    if ('speed' in state) {
      this.speed = state.speed;
    }
  }
}
