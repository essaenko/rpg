import { Entity } from '@shared/ecs/entity';
import { PositionComponent } from '@server/ecs/components/physics/position';

export const getDistance = (e1: Entity, e2: Entity): number => {
  const p1 = e1.get<PositionComponent>('position');
  const p2 = e2.get<PositionComponent>('position');
  const x = Math.abs(p1.x - p2.x);
  const y = Math.abs(p1.y - p2.y);

  return Math.sqrt(x * x + y * y);
};
