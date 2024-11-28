import { Spell } from '@shared/schemas/game/spell/spell';
import { Class } from '@shared/types';
import { Entity } from '@shared/ecs/entity';
import { EquipComponent } from '@server/ecs/components/game/item/equip';
import { ResourceComponent } from '@server/ecs/components/game/stats/resource/resource';
import { getDistance } from '@server/utils/physics';
import { SpellBookComponent } from '@server/ecs/components/game/spells/spell-book';
import { ChangeHealthComponent } from '@server/ecs/components/game/stats/health/change-health';
import { SecondaryStatsComponent } from '@server/ecs/components/game/stats/secondary-stats';

export class Hit extends Spell {
  constructor() {
    super('warrior-hit', 0, 1, 2, Class.Warrior);
  }

  cast(caster: Entity, target: Entity) {
    super.cast(caster, target);

    let health = target.get<ChangeHealthComponent>('change-health');

    if (!health) {
      health = new ChangeHealthComponent();
      health.value = 0;
      target.addComponent(health);
    }

    health.value -= this.damage(caster);
  }

  damage(caster: Entity): number {
    const secondaryStats = caster.get<SecondaryStatsComponent>('secondary-stats');
    const weapon = caster.get<EquipComponent>('equip')?.mainHand;

    return Math.random() * (weapon.attackMax - weapon.attackMin) + weapon.attackMin + secondaryStats.attackPower;
  }

  canCast(caster: Entity, target: Entity): boolean {
    const equip = caster.get<EquipComponent>('equip');
    const resource = caster.get<ResourceComponent>('resource');
    const spellBook = caster.get<SpellBookComponent>('spell-book');

    return (
      equip.mainHand &&
      resource.current >= this.cost &&
      getDistance(caster, target) <= this.range &&
      spellBook.spells.has('warrior-hit')
    );
  }
}
