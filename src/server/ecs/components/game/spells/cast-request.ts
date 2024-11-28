import { Component } from '@shared/ecs/component';
import { Entity } from '@shared/ecs/entity';

export class CastRequestComponent extends Component {
  public spell: string;
  public target: Entity;
  constructor() {
    super('cast-request');
  }

  init(state: Record<string, any>): void {}
}
