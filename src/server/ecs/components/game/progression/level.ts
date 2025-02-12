import { Component, NetworkComponent } from '@shared/ecs/component';
import { type } from '@colyseus/schema';
import { LVL_CAPS } from '@shared/utils/level';

export class Level extends NetworkComponent {
  constructor() {
    super('level');
  }

  serializable = true;

  @type('number') level: number = 1;
  @type('number') exp: number = 0;

  init(state: Record<string, any>): void {
    if ('level' in state) {
      this.level = state.level;
    }
    if ('exp' in state) {
      this.exp = state.exp;
    }
  }

  addExp(amount: number): void {
    if (this.exp + amount >= LVL_CAPS[this.level - 1]) {
      const applied = LVL_CAPS[this.level - 1] - this.exp;
      this.exp = 0;
      this.level++;

      this.addExp(amount - applied);
    } else {
      this.exp += amount;
    }
  }
}
