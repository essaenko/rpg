import { Spell } from '@shared/schemas/game/spell/spell';
import { Entity } from '@shared/ecs/entity';
import { type } from '@colyseus/schema';
import { Dot as DotSpell } from '@server/ecs/components/game/spell/dot';
import { Spells } from '@shared/utils/spells';
import { Relation } from '@shared/types';

export class Dot extends Spell {
  constructor() {
    super(Spells.Dot, 0, 2, 2, 0, [Relation.Hostile, Relation.Neutral]);
  }

  @type('number') amount: number = 15;
  @type('number') duration: number = 10;
  @type('number') interval: number = 2;

  cast(caster: Entity, target: Entity): void {
    const dot = new DotSpell();
    dot.amount = (this.amount / this.duration) * this.interval;
    dot.duration = this.duration;
    dot.interval = this.interval;
    dot.nextTick = 0;
    dot.spell = this.id;
    dot.caster = caster.id;

    target.add(dot);
  }

  proc(caster: Entity, target: Entity): void {}
}
