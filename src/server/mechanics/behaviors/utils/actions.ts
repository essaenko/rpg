import { Action as BSAction, BlueshellState, rc, ResultCode } from 'blueshell';
import { BehaviorState } from '@server/ecs/components/game/behaviour/behavior';
import { Spawn } from '@server/ecs/components/game/mechanics/spawn';
import { Aggro } from '@server/ecs/components/game/behaviour/aggro/aggro';
import { TargetPoint } from '@server/ecs/components/game/behaviour/patrol/target-point';
import { SpellBook } from '@server/ecs/components/game/spell/spell-book';
import { Position } from '@server/ecs/components/physics/position';
import { getDistance } from '@shared/utils/physics';
import { SpellSlot } from '@shared/types';
import { CastRequest } from '@server/ecs/components/game/spell/cast-request';

export class Action<S extends BlueshellState, E> extends BSAction<S, E> {
  constructor(name: string, action: (state?: S, event?: E) => ResultCode) {
    super(name);

    this.onEvent = action;
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
  const [spellId, spell] = spellBook?.spells
    .entries()
    .find(([id, spell]) => getDistance(tpos, pos) <= spell.range);

  if (spell) {
    const cr = new CastRequest();
    cr.target = target;
    cr.spell = spellId as SpellSlot;

    entity.add(cr);
  }

  return rc.SUCCESS;
});
