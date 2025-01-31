import { NetworkComponent } from '@client/core/ecs/component/network-component';
import { SpellBook as SpellBookSchema } from '@server/ecs/components/game/spell/spell-book';
import { Spell } from '@shared/schemas/game/spell/spell';

export class SpellBook extends NetworkComponent {
  constructor() {
    super('spell-book');
  }

  public spells: Map<string, Spell> = new Map();
}
