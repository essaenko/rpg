import { Component } from '@shared/ecs/component';
import { Entity } from '@shared/ecs/entity';
import { Spell } from '@shared/schemas/game/spell/spell';

export class CastComponent extends Component {
  public target: Entity;
  public spell: Spell;

  constructor() {
    super('cast');
  }

  init(state: Record<string, any>): void {
    //TODO Add init handle
  }
}
