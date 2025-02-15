import { Component } from '@shared/ecs/component';
import { Entity } from '@shared/ecs/entity';
import { Spell } from '@shared/schemas/game/spell/spell';

export class Cast extends Component {
  public target: Entity;
  public spell: Spell;
  public finished: boolean;
  public remaining: number;

  constructor() {
    super('cast');
  }

  init(state: Record<string, any>): void {
    //TODO Add init handle
  }
}
