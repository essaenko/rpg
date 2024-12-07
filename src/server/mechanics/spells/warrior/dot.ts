import { Spell } from '@shared/schemas/game/spell/spell';
import { Entity } from '@shared/ecs/entity';
import { HotComponent } from '@server/ecs/components/game/spells/hot';
import { type } from '@colyseus/schema';
import { DotComponent } from '@server/ecs/components/game/spells/dot';
import { WarriorSpells } from '@shared/utils/spells';
import { Relation } from '@shared/types';

export class Dot extends Spell {
  constructor() {
    super(WarriorSpells.Dot, 0, 2, 2, [Relation.Hostile, Relation.Neutral]);
  }

  @type('number') amount: number = 15;
  @type('number') duration: number = 10;
  @type('number') interval: number = 2;

  cast(caster: Entity, target: Entity): void {
    const dot = new DotComponent();
    dot.amount = (this.amount / this.duration) * this.interval;
    dot.duration = this.duration;
    dot.interval = this.interval;
    dot.nextTick = 0;
    dot.spell = this.name;
    dot.caster = caster.id;

    target.addComponent(dot);
  }

  proc(caster: Entity, target: Entity): void {}
}
