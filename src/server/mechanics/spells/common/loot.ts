import { LootingBase } from '@server/mechanics/spells/common/looting';
import { Spells } from '@shared/utils/spells';
import { Relation } from '@shared/types';
import { Entity } from '@shared/ecs/entity';
import { Scene } from '@server/core/scene/scene';
import { type } from '@colyseus/schema';

export class Loot extends LootingBase {
  @type('number') empty3: number = null;
  constructor() {
    super(Spells.Loot, 0, 0, 2, 0, [Relation.Neutral]);
  }

  cast(caster: Entity, target: Entity, scene: Scene) {
    this.handleLootTable(caster, target);
  }

  proc(caster: Entity, target: Entity, scene: Scene): void {}
}
