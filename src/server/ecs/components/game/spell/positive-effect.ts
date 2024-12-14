import { Component } from '@shared/ecs/component';

export class PositiveEffect extends Component {
  constructor() {
    super('positive-effect');
  }

  serializable = true;

  init(state: Record<string, any>): void {
    //TODO Add init handle
  }
}
