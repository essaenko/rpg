import { Predicate, Selector, Sequence, SideEffect } from 'blueshell';
import { BehaviorState } from '@server/ecs/components/game/behaviour/behavior';
import { CreateRoute, FollowRoute, LoopRoute } from '@server/mechanics/behaviors/utils/sequences';

export const PatrolTree = new Sequence<BehaviorState, void>('PatrolSequence', [
  new Predicate('PatrolTreePredicate', () => {
    return true;
  }),
  new Selector('PatrolSelector', [CreateRoute, new Selector('PatrolSelector', [LoopRoute, FollowRoute])]),
]);
