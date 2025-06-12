import { entity } from '@colyseus/schema';
import { Scene } from '@server/core/scene/scene';
import { Damage } from '@server/ecs/components/game/spell/damage';
import { Resource } from '@server/ecs/components/game/stats/resource/resource';
import { Position } from '@server/ecs/components/physics/position';
import { Trigger } from '@server/ecs/components/trigger/trigger';
import { Entity } from '@shared/ecs/entity';
import { Spell } from '@server/mechanics/spells/spell';
import { Relation } from '@shared/types';
import { Spells } from '@shared/utils/spells';

@entity
export class Shot extends Spell {
  constructor() {
    super(Spells.Shot, 10, 5, 5, 1, [Relation.Neutral, Relation.Hostile]);
    this.name = 'Бросок метательного ножа';
    this.description = 'Прицельный бросок метательного ножа.';
  }
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
      d.value = 10;
      target.add(d);

      scene.removeEntity(projectile);
    };

    scene.addEntity(projectile);
  }
  canCast(caster: Entity, target: Entity): boolean {
    return super.canCast(caster, target);
  }
  proc(caster: Entity, target: Entity): void {
    const resource = caster.get<Resource>('resource');

    if (resource) {
      resource.current = Math.max(resource.current - this.cost, 0);
    }
  }
}
