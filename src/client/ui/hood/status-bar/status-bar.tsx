import React from 'react';
import { Health } from '@client/ecs/components/game/stats/health';
import { Name } from '@client/ecs/components/game/ui/name';
import classNames from 'classnames';
import { Resource } from '@client/ecs/components/game/stats/resource';
import { ResourceType } from '@shared/types';

import css from './status-bar.module.css';
import { usePlayerComponent, usePlayerComponentState } from '@client/ui/hooks/component';
import { Level } from '@client/ecs/components/game/mechanics/level';

export const StatusBar: React.FC = () => {
  const name = usePlayerComponent<Name>('name');
  const resource = usePlayerComponentState<Resource>('resource');
  const health = usePlayerComponentState<Health>('health');
  const level = usePlayerComponentState<Level>('level');

  return (name && health && resource && level) && (
    <div className={css.root}>
      <div className={css.avatar}></div>
      <div className={css.info}>
        <div className={css.name}>{name.value} - {level.level} уровень</div>
        <div className={css.health}>
          <div className={css.fill} style={{ width: `${(health.current / health.max) * 100}%` }}></div>
          <span>
            {health.current}/{health.max}
          </span>
        </div>
        <div className={css.resource}>
          <div
            className={classNames(css.fill, {
              [css.rage]: resource.type === ResourceType.Rage,
              [css.mana]: resource.type === ResourceType.Mana,
              [css.energy]: resource.type === ResourceType.Energy,
            })}
            style={{ width: `${(health.current / health.max) * 100}%` }}
          ></div>
          <span>
            {health.current}/{health.max}
          </span>
        </div>
      </div>
    </div>
  );
};
