import { Component } from '@shared/ecs/component';

export class ChangeResource extends Component {
  public value: number = 0;
  constructor() {
    super('change-resource');
  }

  init(state: Record<string, any>): void {
    //TODO Add init handle
  }
}
