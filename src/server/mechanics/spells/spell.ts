import { Spell as SpellBase} from '@shared/schemas/game/spell/spell';
import { Entity, NetworkEntity } from '@shared/ecs/entity';
import { Appearance } from '@server/ecs/components/game/appearance';
import { Body } from '@server/ecs/components/physics/body';
import { Position } from '@server/ecs/components/physics/position';
import { Projectile } from '@server/ecs/components/game/mechanics/projectile';
import { Trigger } from '@server/ecs/components/trigger/trigger';
import { Velocity } from '@server/ecs/components/physics/velocity';
import { Speed } from '@server/ecs/components/physics/speed';
import { nanoid } from 'nanoid';
import { Animation } from '@shared/types';
import { type } from '@colyseus/schema';

type ProjectileConfig = {
  width: number;
  height: number;
  x: number;
  y: number;
  speed: number;
  target: Entity;
}

export abstract class Spell extends SpellBase {
  @type('boolean') empty = true;
  getProjectile({ width, height, x, y, speed, target }: ProjectileConfig) {
    const projectile = new NetworkEntity();
    const a = new Appearance();
    const b = new Body();
    const p = new Position();
    const pr = new Projectile();
    const t = new Trigger('spell-trigger');
    const v = new Velocity();
    const s = new Speed();

    b.init({
      width,
      height,
    });
    p.init({
      x,
      y,
    });
    s.speed = speed;
    pr.target = target;
    t.validate = (e: Entity) => {
      return e === target;
    };
    a.key = 'base';
    a.animation = Animation.Idle;

    projectile.add(b, p, t, v, s, pr, a);
    projectile.id = nanoid(9);

    return projectile;
  }
}