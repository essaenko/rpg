import { entity } from '@colyseus/schema';
import { Component } from '@shared/ecs/component';
import { Pointer2D } from '@shared/types';

@entity
export class Spawn extends Component {
  init(state: { point: Pointer2D }): void {
    this.point = { ...state.point };
  }
  constructor() {
    super('spawn');
  }

  public point: Pointer2D = { x: 0, y: 0 };
}
