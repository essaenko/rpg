import { Spell } from '@shared/schemas/game/spell/spell';
import { Relation } from '@shared/types';
import { Entity } from '@shared/ecs/entity';
import { Gear } from '@server/ecs/components/game/item/gear';
import { Resource } from '@server/ecs/components/game/stats/resource/resource';
import { SecondaryStats } from '@server/ecs/components/game/stats/secondary-stats';
import { Damage } from '@server/ecs/components/game/spell/damage';
import { Spells } from '@shared/utils/spells';
import { entity } from '@colyseus/schema';

@entity
export class Hit extends Spell {
  constructor() {
    super(Spells.Hit, 0, 1, 2, 0, [Relation.Hostile, Relation.Neutral]);
    this.name = 'Удар';
    this.description = 'Совершает удар оружием в правой руке.';
  }

  cast(caster: Entity, target: Entity) {
    const damage = new Damage();
    damage.value = this.damage(caster);
    target.add(damage);
  }

  damage(caster: Entity): number {
    const secondaryStats = caster.get<SecondaryStats>('secondary-stats');
    const weapon = caster.get<Gear>('gear')?.mainHand;

    if (weapon) {
      return weapon.damage() + secondaryStats.attackPower;
    }

    return 0;
  }

  canCast(caster: Entity, target: Entity): boolean {
    const gear = caster.get<Gear>('gear');

    return super.canCast(caster, target) && gear && !!gear.mainHand;
  }

  proc(caster: Entity, target: Entity): void {
    const resource = caster.get<Resource>('resource');

    if (resource) {
      resource.current = Math.min(resource.max, resource.current + 5);
    }
  }
}
