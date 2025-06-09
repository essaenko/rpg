import { Spell } from '@server/mechanics/spells/spell';
import { Relation } from '@shared/types';
import { Entity } from '@shared/ecs/entity';
import { Resource } from '@server/ecs/components/game/stats/resource/resource';
import { SecondaryStats } from '@server/ecs/components/game/stats/secondary-stats';
import { Damage } from '@server/ecs/components/game/spell/damage';
import { Spells } from '@shared/utils/spells';
import { type } from '@colyseus/schema';
import { Scene } from '@server/core/scene/scene';
import { Position } from '@server/ecs/components/physics/position';
import { Trigger } from '@server/ecs/components/trigger/trigger';

export class SplitFire extends Spell {
  constructor() {
    super(Spells.SplitFire, 0, 5, 10, 3, [Relation.Hostile, Relation.Neutral], 0.5);
    this.name = 'Залп стрел';
    this.description = 'Совершает выстрел из оружия каждые 0.5 секунды в течении 3 секунд';
  }

  @type('boolean') empty2 = true;

  cast(caster: Entity, target: Entity, scene: Scene): void {
    const projectile = this.getProjectile({
      width: 32,
      height: 32,
      x: caster.get<Position>('position').x,
      y: caster.get<Position>('position').y,
      speed: 3,
      target,
    });
    const t = projectile.getAll<Trigger>('trigger').find(({ type }) => type === 'spell-trigger');
    t.activate = () => {
      const d = new Damage();
      d.value = this.damage(caster);
      target.add(d);

      scene.removeEntity(projectile);
    };

    scene.addEntity(projectile);
  }

  damage(caster: Entity): number {
    const secondaryStats = caster.get<SecondaryStats>('secondary-stats');

    return (secondaryStats.attackPower + 10) / 6;
  }

  canCast(caster: Entity, target: Entity): boolean {
    return super.canCast(caster, target);
  }

  proc(caster: Entity, target: Entity): void {
    const resource = caster.get<Resource>('resource');

    if (resource) {
      resource.current = Math.min(resource.max, resource.current + 5);
    }
  }
}
