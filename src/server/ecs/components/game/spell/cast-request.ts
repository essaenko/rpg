import { Component } from '@shared/ecs/component';
import { Entity } from '@shared/ecs/entity';
import { SpellSlot } from '@shared/types';

export class CastRequest extends Component {
  public spell: SpellSlot;
  public target: Entity;
  constructor() {
    super('cast-request');
  }

  init({ spell, target }: { spell: SpellSlot; target: Entity }): void {
    this.spell = spell;
    this.target = target;
  }
}
