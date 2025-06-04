import { BehaviorState } from '@server/ecs/components/game/behaviour/behavior';
import { Predicate } from 'blueshell';
import { TargetPoint } from '@server/ecs/components/game/behaviour/patrol/target-point';
import { Position } from '@server/ecs/components/physics/position';
import { isInTheSamePosition } from '@shared/utils/physics';
import { tileToPosition } from '@server/utils/map/tiled';
import { Route } from '@server/ecs/components/physics/route';

export const TargetPointReached = new Predicate<BehaviorState, void>('RouteNodeReached', ({ entity, container }) => {
  const target = entity.get<TargetPoint>('target-point');
  const pos = entity.get<Position>('position');

  if (!target) {
    return false;
  }

  return isInTheSamePosition(pos, target, 5);
});

export const HasRoute = new Predicate<BehaviorState, void>('HasRoute', ({ entity, container }) => {
  return entity.has('route');
});

export const EndOfTheRouteReached = new Predicate<BehaviorState, void>(
  'IsTheEndOfTheRouteReached',
  ({ entity, container }) => {
    const route = entity.get<Route>('route');

    return route.path.at(-1) === route.current;
  },
);
