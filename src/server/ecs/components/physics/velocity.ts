import { Component } from '@shared/ecs/component';

export class VelocityComponent extends Component {
  constructor() {
    super('velocity');
  }

  public x: number = 0;
  public y: number = 0;

  init(state: Record<string, any>): void {}
}
