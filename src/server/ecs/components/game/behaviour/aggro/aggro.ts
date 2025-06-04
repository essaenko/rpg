import { Component } from '@shared/ecs/component';
import { Entity } from '@shared/ecs/entity';

export class Aggro extends Component {
  public range: number;
  public recovering: boolean = false;
  public target: Entity;

  constructor() {
    super('aggro');
  }

  init(state: { range: number }) {
    if (state.range) {
      this.range = state.range;
    }
  }
}
