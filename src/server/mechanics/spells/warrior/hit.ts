import { Spell } from '@shared/schemas/game/spell/spell';
import { Class, Relation } from '@shared/types';
import { Entity } from '@shared/ecs/entity';
import { EquipComponent } from '@server/ecs/components/game/item/equip';
import { ResourceComponent } from '@server/ecs/components/game/stats/resource/resource';
import { getDistance } from '@server/utils/physics';
import { SpellBookComponent } from '@server/ecs/components/game/spells/spell-book';
import { ChangeHealthComponent } from '@server/ecs/components/game/stats/health/change-health';
import { SecondaryStatsComponent } from '@server/ecs/components/game/stats/secondary-stats';
import { DamageComponent } from '@server/ecs/components/game/spells/damage';
import { WarriorSpells } from '@shared/utils/spells';

export class Hit extends Spell {
  constructor() {
    super(WarriorSpells.Hit, 0, 1, 2, [Relation.Hostile, Relation.Neutral]);
  }

  cast(caster: Entity, target: Entity) {
    const damage = new DamageComponent();
    damage.value = this.damage(caster);
    target.addComponent(damage);
  }

  damage(caster: Entity): number {
    const secondaryStats = caster.get<SecondaryStatsComponent>('secondary-stats');
    const weapon = caster.get<EquipComponent>('equip')?.mainHand;

    if (weapon) {
      return weapon.damage() + secondaryStats.attackPower;
    }

    return 0;
  }

  canCast(caster: Entity, target: Entity): boolean {
    const equip = caster.get<EquipComponent>('equip');

    return super.canCast(caster, target) && !!equip.mainHand;
  }

  proc(caster: Entity, target: Entity): void {
    const resource = caster.get<ResourceComponent>('resource');

    if (resource) {
      resource.current = Math.min(resource.max, resource.current + 5);
    }
  }
}
