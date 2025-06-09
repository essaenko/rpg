import { Component } from '@shared/ecs/component';
import { Pointer2D } from '@shared/types';

export class Route extends Component {
  public path: Pointer2D[];
  public current: Pointer2D;

  constructor() {
    super('route');
  }

  init(state: Record<string, any>): void {}
}
