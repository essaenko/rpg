import { Component } from '@shared/ecs/component';
import { type } from '@colyseus/schema';

export class HotComponent extends Component {
  constructor() {
    super('hot');
  }

  @type('number') amount: number;
  @type('number') interval: number;
  @type('number') duration: number;
  public nextTick: number;
  public spell: number;
  public caster: string;

  init(state: Record<string, any>): void {
    //TODO Add init handle
  }
}
