import React, { useCallback, useEffect } from 'react';

import css from './resurrection.module.css';
import { usePlayerComponentState } from '@client/ui/hooks/component';
import type { Death } from '@client/ecs/components/game/mechanics/death';
import { Networking } from '@client/services/networking';
import { TransportEventTypes } from '@shared/types';

export const Resurrection: React.FC<{}> = () => {
  const death = usePlayerComponentState<Death>('death');

  const onResurrect = useCallback(() => {
    Networking.instance.room.send(TransportEventTypes.Resurrect);
  }, []);

  return death?.dead ? (
    <div className={css.root}>
      <div className={css.modal}>
        <div className={css.header}>Ваш персонаж погиб.</div>
        <div className={css.content}>
          <button onClick={onResurrect}>Вернуться в ближайший город</button>
        </div>
      </div>
    </div>
  ) : null;
};
