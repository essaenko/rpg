import { Spell } from '@shared/schemas/game/spell/spell';
import { Entity } from '@shared/ecs/entity';
import { Heal as HealComponent } from '@server/ecs/components/game/spell/heal';
import { Spells } from '@shared/utils/spells';
import { Relation } from '@shared/types';

export class Heal extends Spell {
  constructor() {
    super(Spells.Heal, 0, 5, 5, 0, [Relation.Friendly, Relation.Neutral]);
  }

  canCast(caster: Entity, target: Entity): boolean {
    return super.canCast(caster, target);
  }

  cast(caster: Entity, target: Entity) {
    const heal = new HealComponent();
    heal.value = 15;

    target.add(heal);
  }

  proc(caster: Entity, target: Entity): void {}
}
