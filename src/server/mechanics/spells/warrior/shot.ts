import { type } from '@colyseus/schema';
import { Scene } from '@server/core/scene/scene';
import { Appearance } from '@server/ecs/components/game/appearance';
import { Projectile } from '@server/ecs/components/game/mechanics/projectile';
import { Damage } from '@server/ecs/components/game/spell/damage';
import { Resource } from '@server/ecs/components/game/stats/resource/resource';
import { Body } from '@server/ecs/components/physics/body';
import { Collider } from '@server/ecs/components/physics/collider';
import { Position } from '@server/ecs/components/physics/position';
import { Speed } from '@server/ecs/components/physics/speed';
import { Velocity } from '@server/ecs/components/physics/velocity';
import { Trigger } from '@server/ecs/components/trigger/trigger';
import { Entity, NetworkEntity } from '@shared/ecs/entity';
import { Spell } from '@shared/schemas/game/spell/spell';
import { Animation, Relation } from '@shared/types';
import { Spells } from '@shared/utils/spells';
import { nanoid } from 'nanoid';

export class Shot extends Spell {
  constructor() {
    super(Spells.Shot, 10, 5, 10, 1, [Relation.Neutral, Relation.Hostile]);
    this.name = 'Бросок метательного ножа';
    this.description = 'Прицельный бросок метательного ножа.';
  }

  @type('boolean') empty = true;
  cast(caster: Entity, target: Entity, scene: Scene): void {
    const projectile = new NetworkEntity();
    const a = new Appearance();
    const b = new Body();
    const p = new Position();
    const pr = new Projectile();
    const t = new Trigger('spell-trigger');
    const v = new Velocity();
    const s = new Speed();

    b.init({
      width: 32,
      height: 32,
    });
    p.init({
      x: caster.get<Position>('position').x,
      y: caster.get<Position>('position').y,
    });
    s.speed = 3;
    pr.target = target;
    t.validate = (e: Entity) => {
      return e === target;
    };
    t.activate = () => {
      const d = new Damage();
      d.value = 10;
      target.add(d);

      scene.removeEntity(projectile);
    };
    a.key = 'base';
    a.animation = Animation.Idle;

    projectile.add(b, p, t, v, s, pr, a);
    projectile.id = nanoid(9);

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
