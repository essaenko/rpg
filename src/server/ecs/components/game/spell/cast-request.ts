import { Component } from '@shared/ecs/component';
import { Entity } from '@shared/ecs/entity';

export class CastRequest extends Component {
  public spell: number;
  public target: Entity;
  constructor() {
    super('cast-request');
  }

  init({ spell, target }: { spell: number; target: Entity }): void {
    this.spell = spell;
    this.target = target;
  }
}
