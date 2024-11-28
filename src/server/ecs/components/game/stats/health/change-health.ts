import { Component } from '@shared/ecs/component';

export class ChangeHealthComponent extends Component {
  public value: number;
  constructor() {
    super('change-health');
  }

  init(state: Record<string, any>): void {
    //TODO Add init handle
  }
}
