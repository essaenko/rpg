import { Component } from '@shared/ecs/component';
import { type } from '@colyseus/schema';

export class SecondaryStats extends Component {
  constructor() {
    super('secondary-stats');
  }

  serializable = true;

  @type('number') crit: number = 0;
  @type('number') armor: number = 0;
  @type('number') attackPower: number = 0;
  @type('number') spellPower: number = 0;
  @type('number') parry: number = 0;
  @type('number') avoid: number = 0;
  @type('number') block: number = 0;

  init(state: Record<string, any>): void {
    if ('crit' in state) {
      this.crit = state.crit;
    }
    if ('armor' in state) {
      this.armor = state.armor;
    }
    if ('attackPower' in state) {
      this.attackPower = state.attackPower;
    }
    if ('spellPower' in state) {
      this.spellPower = state.spellPower;
    }
    if ('parry' in state) {
      this.parry = state.parry;
    }
    if ('avoid' in state) {
      this.avoid = state.avoid;
    }
    if ('block' in state) {
      this.block = state.block;
    }
  }
}
