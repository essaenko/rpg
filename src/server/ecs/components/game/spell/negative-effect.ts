import { Component } from '@shared/ecs/component';

export class NegativeEffect extends Component {
  constructor() {
    super('negative-effect');
  }

  serializable = true;

  init(state: Record<string, any>): void {
    //TODO Add init handle
  }
}
