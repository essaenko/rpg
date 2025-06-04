import { Action as BSAction, BlueshellState, rc, ResultCode } from 'blueshell';
import { BehaviorState } from '@server/ecs/components/game/behaviour/behavior';
import { Spawn } from '@server/ecs/components/game/mechanics/spawn';
import { Aggro } from '@server/ecs/components/game/behaviour/aggro/aggro';
import { TargetPoint } from '@server/ecs/components/game/behaviour/patrol/target-point';
import { SpellBook } from '@server/ecs/components/game/spell/spell-book';
import { Position } from '@server/ecs/components/physics/position';
import { getDistance } from '@shared/utils/physics';
import { CastRequest } from '@server/ecs/components/game/spell/cast-request';

export class Action<S extends BlueshellState, E> extends BSAction<S, E> {
  constructor(name: string, action: (state?: S, event?: E) => ResultCode) {
    super(name);

    this.onEvent = action;
  }
}

export class MoveToSpawnPoint extends BSAction<BehaviorState, void> {
  constructor() {
    super('MoveToSpawnPoint');
  }

  onEvent({ entity, container }: BehaviorState) {
    const spawn = entity.get<Spawn>('spawn');
    const aggro = entity.get<Aggro>('aggro');

    if (!aggro.recovering) {
      aggro.recovering = true;

      const target = new TargetPoint();
      target.x = spawn.point.x;
      target.y = spawn.point.y;

      entity.add(target);
    }

    return rc.RUNNING;
  }
}

export const CastSpellAtTarget = new Action<BehaviorState, void>('CastSpellAtTarget', ({ entity, container }) => {
  if (entity.has('cast-request') || entity.has('cast') || entity.has('channeling')) {
    return rc.RUNNING;
  }

  const aggro = entity.get<Aggro>('aggro');
  const target = aggro.target;
  const tpos = target.get<Position>('position');
  const pos = entity.get<Position>('position');
  const spellBook = entity.get<SpellBook>('spell-book');
  const spell = spellBook?.spells.values().find((spell) => getDistance(tpos, pos) <= spell.range);

  if (spell) {
    const cr = new CastRequest();
    cr.target = target;
    cr.spell = spell.id;

    entity.add(cr);
  }

  return rc.SUCCESS;
});
