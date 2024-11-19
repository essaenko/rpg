import { Component } from '@shared/ecs/component';
import { Directions } from '@shared/types';

export class MoveComponent extends Component {
  constructor() {
    super('move');
  }

  public direction: Directions[] = [];

  init(state: Record<string, any>): void {}
}
