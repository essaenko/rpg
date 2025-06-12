import { Entity } from '@shared/ecs/entity';
import { Scene } from '@server/core/scene/scene';
import { Spells } from '@shared/utils/spells';
import { Relation } from '@shared/types';
import { LootingBase } from '@server/mechanics/spells/common/looting';
import { type } from '@colyseus/schema';

export class Gather extends LootingBase {
  @type('number') empty3: number = null;
  constructor() {
    super(Spells.Gather, 0, 0, 2, 2, [Relation.Neutral]);
  }

  cast(caster: Entity, target: Entity, scene: Scene) {
    this.handleLootTable(caster, target);
  }

  proc() {}
}
