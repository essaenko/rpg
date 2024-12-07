import { Component } from '@shared/ecs/component';
import { type } from '@colyseus/schema';

export class DotComponent extends Component {
  constructor() {
    super('dot');
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
