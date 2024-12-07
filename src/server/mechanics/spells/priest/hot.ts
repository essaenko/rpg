import { Spell } from '@shared/schemas/game/spell/spell';
import { Entity } from '@shared/ecs/entity';
import { HotComponent } from '@server/ecs/components/game/spells/hot';
import { type } from '@colyseus/schema';
import { WarriorSpells } from '@shared/utils/spells';
import { Relation } from '@shared/types';

export class Hot extends Spell {
  @type('number') amount: number = 15;
  @type('number') duration: number = 10;
  @type('number') interval: number = 2;

  constructor() {
    super(WarriorSpells.Hot, 0, 1, 5, [Relation.Friendly, Relation.Neutral]);
  }

  cast(caster: Entity, target: Entity): void {
    const hot = new HotComponent();
    hot.amount = (this.amount / this.duration) * this.interval;
    hot.duration = this.duration;
    hot.interval = this.interval;
    hot.nextTick = 0;
    hot.spell = this.name;
    hot.caster = caster.id;

    target.addComponent(hot);
  }

  proc(caster: Entity, target: Entity): void {}
}
