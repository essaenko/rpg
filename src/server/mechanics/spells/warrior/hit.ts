import { Spell } from '@shared/schemas/game/spell/spell';
import { Relation } from '@shared/types';
import { Entity } from '@shared/ecs/entity';
import { Equip } from '@server/ecs/components/game/item/equip';
import { Resource } from '@server/ecs/components/game/stats/resource/resource';
import { SecondaryStats } from '@server/ecs/components/game/stats/secondary-stats';
import { Damage } from '@server/ecs/components/game/spell/damage';
import { Spells } from '@shared/utils/spells';
import { type } from '@colyseus/schema';

export class Hit extends Spell {
  constructor() {
    super(Spells.Hit, 0, 1, 2, [Relation.Hostile, Relation.Neutral]);
    this.name = 'Удар';
    this.description = 'Совершает удар оружием в правой руке.';
  }

  @type('boolean') empty = true;

  cast(caster: Entity, target: Entity) {
    const damage = new Damage();
    damage.value = this.damage(caster);
    target.addComponent(damage);
  }

  damage(caster: Entity): number {
    const secondaryStats = caster.get<SecondaryStats>('secondary-stats');
    const weapon = caster.get<Equip>('equip')?.mainHand;

    if (weapon) {
      return weapon.damage() + secondaryStats.attackPower;
    }

    return 0;
  }

  canCast(caster: Entity, target: Entity): boolean {
    const equip = caster.get<Equip>('equip');

    return super.canCast(caster, target) && equip && !!equip.mainHand;
  }

  proc(caster: Entity, target: Entity): void {
    const resource = caster.get<Resource>('resource');

    if (resource) {
      resource.current = Math.min(resource.max, resource.current + 5);
    }
  }
}
