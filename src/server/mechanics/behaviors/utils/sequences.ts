import { Predicate, rc, Selector, Sequence, SideEffect } from 'blueshell';
import { RoutePath } from '@server/ecs/components/physics/route-path';
import { Position } from '@server/ecs/components/physics/position';
import { AStarService } from '@shared/ecs/service/a-star';
import { positionToTile, tileToPosition } from '@server/utils/map/tiled';
import { Route } from '@server/ecs/components/physics/route';
import { BehaviorState } from '@server/ecs/components/game/behaviour/behavior';
import { EndOfTheRouteReached, HasRoute, TargetPointReached } from '@server/mechanics/behaviors/utils/predicates';
import { TargetPoint } from '@server/ecs/components/game/behaviour/patrol/target-point';
import { Action } from '@server/mechanics/behaviors/utils/actions';

export const CreateRoute = new Sequence<BehaviorState, void>('CreateRoute', [
  new Predicate('HasRoutePath', ({ entity }) => {
    return entity.has('route-path');
  }),
  new SideEffect('CreateRoute', async ({ entity, container }) => {
    const path = entity.get<RoutePath>('route-path');
    const pos = entity.get<Position>('position');
    let apath = [];
    for (let i = 0; i < path.path.length; i++) {
      const node = path.path[i];
      const curr = i === 0 ? pos : path.path[i - 1];
      apath.push(
        ...((await container
          .getService<AStarService>('a-star')
          .find(positionToTile(curr.x, curr.y), positionToTile(node.x, node.y))) ?? []),
      );
    }
    const route = new Route();
    route.path = apath;
    route.current = apath.at(0);

    entity.add(route);
    entity.remove(path);
  }),
]);

export const LoopRoute = new Sequence<BehaviorState, void>('LoopRoute', [
  HasRoute,
  TargetPointReached,
  EndOfTheRouteReached,
  new Action('LoopRoute', ({ entity, container }) => {
    const route = entity.get<Route>('route');

    route.current = route.path.at(0);

    return rc.SUCCESS;
  }),
]);

export const FollowRoute = new Sequence<BehaviorState, void>('FollowRoute', [
  HasRoute,
  new Selector('FollowRouteNode', [
    new Sequence('StopAtTheEndOfTheRoute', [
      TargetPointReached,
      EndOfTheRouteReached,
      new Action('RemoveRouteFromEntity', ({ entity, container }) => {
        entity.remove('route');
        entity.remove('target-point');

        return rc.SUCCESS;
      }),
    ]),
    new Sequence('SetCurrentNode', [
      TargetPointReached,
      new Action('SetCurrentNodeToNext', ({ entity, container }) => {
        const route = entity.get<Route>('route');
        const pointer = entity.get<TargetPoint>('target-point');

        route.current = route.path.at(route.path.indexOf(route.current) + 1);
        const dest = tileToPosition(route.current.x, route.current.y);

        pointer.x = dest.x;
        pointer.y = dest.y;

        return rc.SUCCESS;
      }),
    ]),
    new Action('MoveTowardsNode', ({ entity, container }) => {
      let pointer = entity.get<TargetPoint>('target-point');
      const route = entity.get<Route>('route');
      const routeTarget = tileToPosition(route.current.x, route.current.y);

      if (!pointer) {
        pointer = new TargetPoint();

        entity.add(pointer);
      }

      if (pointer.x !== routeTarget.x || pointer.y !== routeTarget.y) {
        pointer.x = routeTarget.x;
        pointer.y = routeTarget.y;
      }

      return rc.RUNNING;
    }),
  ]),
]);
