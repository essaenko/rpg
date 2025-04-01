import { Component } from '@shared/ecs/component';

export class Location extends Component {
  public value: string;
  public serializable: boolean = true;

  init(state: Record<string, any>): void {
    this.value = state.value;
  }
  constructor() {
    super('location');
  }
}
