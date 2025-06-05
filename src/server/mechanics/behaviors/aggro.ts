import { LatchedSelector, LatchedSequence, Predicate, rc, Selector, Sequence, SideEffect } from 'blueshell';
import { BehaviorState } from '@server/ecs/components/game/behaviour/behavior';
import { Aggro } from '@server/ecs/components/game/behaviour/aggro/aggro';
import { SpellBook } from '@server/ecs/components/game/spell/spell-book';
import { getDistance, isInTheSamePosition } from '@shared/utils/physics';
import { Spawn } from '@server/ecs/components/game/mechanics/spawn';
import { Position } from '@server/ecs/components/physics/position';
import { HasRoute } from '@server/mechanics/behaviors/utils/predicates';
import { Action, CastSpellAtTarget } from '@server/mechanics/behaviors/utils/actions';
import { TargetPoint } from '@server/ecs/components/game/behaviour/patrol/target-point';
import { CreateRoute, FollowRoute } from '@server/mechanics/behaviors/utils/sequences';
import { RoutePath } from '@server/ecs/components/physics/route-path';

export const AggroTree = new Sequence('AggroSequence', [
  new Predicate<BehaviorState, void>('AggroPredicate', ({ entity, container }) => {
    return entity.has('aggro');
  }),
  new LatchedSelector<BehaviorState, void>('AggroSelector', [
    new Sequence('GetBackToRest', [
      new Predicate('IfFarAwayFromSpot', ({ entity, container }) => {
        const spawn = entity.get<Spawn>('spawn');
        const pos = entity.get<Position>('position');
        const aggro = entity.get<Aggro>('aggro');

        return getDistance(spawn.point, pos) > 250 || aggro.recovering;
      }),
      new SideEffect('StopChasingPlayer', ({ entity }) => {
        const aggro = entity.get<Aggro>('aggro');
        if (!aggro.recovering) {
          entity.remove('target-point');
        }
      }),
      new Sequence('MoveToSpawnPoint', [
        new SideEffect('SetRoutePathToSpawn', ({ entity }) => {
          const aggro = entity.get<Aggro>('aggro');

          if (!aggro.recovering) {
            const spawn = entity.get<Spawn>('spawn');
            const pos = entity.get<Position>('position');
            const path = new RoutePath();
            path.path = [
              { x: pos.x, y: pos.y },
              { x: spawn.point.x, y: spawn.point.y },
            ];

            entity.add(path);
          }
        }),
        new Selector('CreateRouteIfNeeded', [
          new Sequence('CreateRoute', [
            new Predicate('IsCharacterNotMovingToSpawn', ({ entity }) => {
              const aggro = entity.get<Aggro>('aggro');

              return !aggro.recovering;
            }),
            CreateRoute,
            new SideEffect('SetCharacterGoingToSpawn', ({ entity }) => {
              const aggro = entity.get<Aggro>('aggro');
              aggro.recovering = true;
            }),
          ]),
          new Action('RouteAlreadyExists', () => {
            return rc.SUCCESS;
          }),
        ]),
        new Sequence('GoBackToSpawn', [HasRoute, FollowRoute]),
      ]),
      new SideEffect('RestAtSpawnPoint', ({ entity, container }) => {
        entity.remove('target-point');
        const aggro = entity.get<Aggro>('aggro');

        if (aggro) {
          aggro.recovering = false;
        }
      }),
    ]),
    new Sequence('AttackTarget', [
      new Predicate('PlayerInRange', ({ entity, container }) => {
        const aggro = entity.get<Aggro>('aggro');
        return Array.from(container.query(entity, aggro.range, ['tag-player'])).length > 0;
      }),
      new SideEffect<BehaviorState, void>('SelectATarget', ({ entity, container }) => {
        const aggro = entity.get<Aggro>('aggro');

        aggro.target = Array.from(container.query(entity, aggro.range, ['tag-player'])).at(0) ?? null;
      }),
      new Selector<BehaviorState, void>('BattleActionSelector', [
        new Sequence('CastSpellAtTarget', [
          new Predicate('PlayerInRangeForCast', ({ entity, container }) => {
            const spellBook = entity.get<SpellBook>('spell-book');
            const aggro = entity.get<Aggro>('aggro');
            const tPos = aggro.target.get<Position>('position');
            const pos = entity.get<Position>('position');
            const distance = getDistance(pos, tPos);

            if (spellBook) {
              for (const spell of spellBook.spells.values()) {
                if (distance <= spell.range) {
                  return true;
                }
              }
            }

            return false;
          }),
          new SideEffect('StopChasingPlayer', ({ entity }) => {
            entity.remove('target-point');
          }),
          CastSpellAtTarget,
        ]),
        new Sequence<BehaviorState, void>('ChasePlayer', [
          new SideEffect('SetTargetPointToTargetPlayer', ({ entity, container }) => {
            const aggro = entity.get<Aggro>('aggro');
            const pos = entity.get<Position>('position');
            const tpos = aggro.target.get<Position>('position');
            let target = entity.get<TargetPoint>('target-point');

            if (isInTheSamePosition(pos, tpos, 5)) {
              entity.remove('target-point');

              return;
            }

            if (!target) {
              target = new TargetPoint();
              entity.add(target);
            }

            if (!isInTheSamePosition(target, tpos, 5)) {
              target.x = tpos.x;
              target.y = tpos.y;
            }
          }),
        ]),
      ]),
    ]),
  ]),
]);
