import { Spell } from '@shared/schemas/game/spell/spell';
import { Class } from '@shared/types';
import { Entity } from '@shared/ecs/entity';
import { EquipComponent } from '@server/ecs/components/game/item/equip';
import { ResourceComponent } from '@server/ecs/components/game/stats/resource/resource';

export class Hit extends Spell {
  constructor() {
    super('warrior-hit', 0, 1, Class.Warrior);
  }

  canCast(caster: Entity, target: Entity): boolean {
    const equip = caster.get<EquipComponent>('equip');
    const resource = caster.get<ResourceComponent>('resource');

    return equip.mainHand && resource.current >= this.cost;
  }
}
