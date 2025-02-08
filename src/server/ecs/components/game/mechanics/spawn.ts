import { type } from '@colyseus/schema';
import { Component } from '@shared/ecs/component';
import { Position } from '@shared/types';

export class Spawn extends Component {
  @type('boolean') empty = true;
  init(state: Record<string, any>): void {}
  constructor() {
    super('spawn');
  }

  public point: Position = { x: 0, y: 0 };
}
