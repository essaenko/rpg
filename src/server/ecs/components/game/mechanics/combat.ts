import { Component } from '@shared/ecs/component';
import { Entity } from '@shared/ecs/entity';

export class Combat extends Component {
  init(state: Record<string, any>): void {}

  public enemy: Entity = null;

  constructor() {
    super('combat');
  }
}
