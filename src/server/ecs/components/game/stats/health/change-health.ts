import { Component } from '@shared/ecs/component';

export class ChangeHealthComponent extends Component {
  public value: number = 0;
  constructor() {
    super('change-health');
  }

  init(state: Record<string, any>): void {
    //TODO Add init handle
  }
}
