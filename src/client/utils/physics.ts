import { Entity } from '@client/core/ecs/entity/entity';
import { Position } from '@client/ecs/components/physics/position';

export const getDistance = (e1: Entity, e2: Entity): number => {
  const p1 = e1.get<Position>('position');
  const p2 = e2.get<Position>('position');
  const x = Math.abs(p1.x - p2.x);
  const y = Math.abs(p1.y - p2.y);

  return Math.sqrt(x * x + y * y);
};
