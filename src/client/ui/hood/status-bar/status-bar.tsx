import React, { useContext, useMemo } from 'react';
import { PlayerContext } from '../../context/player.context';
import { Health } from '@client/ecs/components/game/stats/health';
import { Name } from '@client/ecs/components/game/ui/name';
import classNames from 'classnames';
import { Resource } from '@client/ecs/components/game/stats/resource';
import { ResourceType } from '@shared/types';

import css from './status-bar.module.css';

export const StatusBar: React.FC = () => {
  const player = useContext(PlayerContext);
  const nc = useMemo(() => player?.get<Name>('name') ?? { value: 'CharacterName' }, [player]);
  const hc = useMemo(() => player?.get<Health>('health') ?? { current: 0, max: 0 }, [player]);
  const rc = useMemo(
    () => player?.get<Resource>('resource') ?? { current: 0, max: 0, type: ResourceType.Mana },
    [player],
  );
  const health = useMemo(
    () => ({
      current: hc.current,
      max: hc.max,
    }),
    [hc.current, hc.max],
  );

  return (
    <div className={css.root}>
      <div className={css.avatar}></div>
      <div className={css.info}>
        <div className={css.name}>{nc.value}</div>
        <div className={css.health}>
          <div className={css.fill} style={{ width: `${(health.current / health.max) * 100}%` }}></div>
          <span>
            {health.current}/{health.max}
          </span>
        </div>
        <div className={css.resource}>
          <div
            className={classNames(css.fill, {
              [css.rage]: rc.type === ResourceType.Rage,
              [css.mana]: rc.type === ResourceType.Mana,
              [css.energy]: rc.type === ResourceType.Energy,
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
