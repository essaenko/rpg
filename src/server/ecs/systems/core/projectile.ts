import { Scene } from '@server/core/scene/scene';
import { Projectile } from '@server/ecs/components/game/mechanics/projectile';
import { Position } from '@server/ecs/components/physics/position';
import { Speed } from '@server/ecs/components/physics/speed';
import { Velocity } from '@server/ecs/components/physics/velocity';
import { DEFAULT_SPEED } from '@server/utils/game/const';
import { ECSContainer } from '@shared/ecs';
import { Entity } from '@shared/ecs/entity';
import { System } from '@shared/ecs/system';
import { TransportEventTypes } from '@shared/types';
import { getVelocityByVector } from '@shared/utils/physics';
import { Client } from 'colyseus';

export class ProjectileSystem extends System {
  handleMessage(client: Client, type: TransportEventTypes, message: any, container: ECSContainer): void {
    //
  }
  onUpdate(delta: number, container: ECSContainer, scene: Scene): void {
    for (const entity of container.query(['projectile'])) {
      const p = entity.get<Projectile>('projectile');
      const v = entity.get<Velocity>('velocity');
      if (p.target) {
        const tPos = p.target instanceof Entity ? p.target.get<Position>('position') : p.target;
        const dir = getVelocityByVector(entity.get<Position>('position'), tPos);

        if (dir.x !== v.x || dir.y !== v.y) {
          const s = entity.get<Speed>('speed');
          v.x = dir.x * s.speed * DEFAULT_SPEED * delta;
          v.y = dir.y * s.speed * DEFAULT_SPEED * delta;
        }
      }
    }
  }
  constructor() {
    super('projectile');
  }
}
