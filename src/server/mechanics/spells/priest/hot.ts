import { Spell } from '@shared/schemas/game/spell/spell';
import { Entity } from '@shared/ecs/entity';
import { Hot as HotComponent } from '@server/ecs/components/game/spell/hot';
import { type } from '@colyseus/schema';
import { Spells } from '@shared/utils/spells';
import { Relation } from '@shared/types';

export class Hot extends Spell {
  @type('number') amount: number = 15;
  @type('number') duration: number = 10;
  @type('number') interval: number = 2;

  constructor() {
    super(Spells.Hot, 0, 1, 5, 0, [Relation.Friendly, Relation.Neutral]);
  }

  cast(caster: Entity, target: Entity): void {
    const hot = new HotComponent();
    hot.amount = (this.amount / this.duration) * this.interval;
    hot.duration = this.duration;
    hot.interval = this.interval;
    hot.nextTick = 0;
    hot.spell = this.id;
    hot.caster = caster.id;

    target.add(hot);
  }

  proc(caster: Entity, target: Entity): void {}
}
