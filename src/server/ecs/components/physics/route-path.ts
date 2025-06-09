import { Component } from '@shared/ecs/component';
import { Pointer2D } from '@shared/types';

export class RoutePath extends Component {
  public path: Pointer2D[];

  constructor() {
    super('route-path');
  }

  init() {}
}
