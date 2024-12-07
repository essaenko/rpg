import { Entity } from '@shared/ecs/entity';
import { PositionComponent } from '@server/ecs/components/physics/position';
import { Position } from '@shared/types';

export const getDistance = (e1: Entity, e2: Entity): number => {
  const p1 = e1.get<PositionComponent>('position');
  const p2 = e2.get<PositionComponent>('position');
  const x = Math.abs(p1.x - p2.x);
  const y = Math.abs(p1.y - p2.y);

  return Math.sqrt(x * x + y * y);
};

export const getVelocityByVector = (p1: Position, p2: Position): Position => {
  const vector = { x: p2.x - p1.x, y: p2.y - p1.y };
  const R = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
  const sin = vector.y / R;
  const cos = vector.x / R;

  return {
    x: cos,
    y: sin,
  };
};

export const isInTheSamePosition = (p1: Position, p2: Position, accuracy: number = 0): boolean => {
  return (
    Math.round(p1.x) >= Math.round(p2.x - accuracy) &&
    Math.round(p1.x) <= Math.round(p2.x + accuracy) &&
    Math.round(p1.y) >= Math.round(p2.y - accuracy) &&
    Math.round(p1.y) <= Math.round(p2.y + accuracy)
  );
};
