import { Component } from '@shared/ecs/component';

export class Velocity extends Component {
  constructor() {
    super('velocity');
  }

  serializable = true;

  public x: number = 0;
  public y: number = 0;

  init(state: Record<string, any>): void {}

  serialize() {
    return {
      name: this.name,
    };
  }
}
