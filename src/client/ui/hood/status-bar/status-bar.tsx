import React from 'react';
import { Health } from '@client/ecs/components/game/stats/health';
import { Name } from '@client/ecs/components/game/ui/name';
import classNames from 'classnames';
import { Resource } from '@client/ecs/components/game/stats/resource';
import { ResourceType } from '@shared/types';

import css from './status-bar.module.css';
import { usePlayerComponent, usePlayerComponentState } from '@client/ui/hooks/component';
import { Level } from '@client/ecs/components/game/mechanics/level';
import { MainStats } from '@client/ecs/components/game/stats/main-stats';
import { SecondaryStats } from '@client/ecs/components/game/stats/secondary-stats';

export const StatusBar: React.FC = () => {
  const name = usePlayerComponent<Name>('name');
  const resource = usePlayerComponentState<Resource>('resource');
  const health = usePlayerComponentState<Health>('health');
  const level = usePlayerComponentState<Level>('level');

  const mStats = usePlayerComponentState<MainStats>('main-stats');
  const sStats = usePlayerComponentState<SecondaryStats>('secondary-stats');

  return (
    name &&
    health &&
    resource &&
    level && (
      <div className={css.root}>
        <div className={css.block}>
          <div className={css.avatar}></div>
          <div className={css.info}>
            <div className={css.name}>
              {name.value} - {level.level} уровень
            </div>
            <div className={css.health}>
              <div className={css.fill} style={{ width: `${(health.current / health.max) * 100}%` }}></div>
              <span>
                {Math.round(health.current)}/{Math.round(health.max)}
              </span>
            </div>
            <div className={css.resource}>
              <div
                className={classNames(css.fill, {
                  [css.rage]: resource.type === ResourceType.Rage,
                  [css.mana]: resource.type === ResourceType.Mana,
                  [css.energy]: resource.type === ResourceType.Energy,
                })}
                style={{ width: `${(resource.current / resource.max) * 100}%` }}
              ></div>
              <span>
                {Math.round(resource.current)}/{Math.round(resource.max)}
              </span>
            </div>
          </div>
        </div>
        {mStats && (
          <div className={css.block} style={{ flexDirection: 'column' }}>
            <h3>Характеристики:</h3>
            <h4>Основные:</h4>
            <p>Сила: {mStats.strength}</p>
            <p>Ловкость: {mStats.agility}</p>
            <p>Интеллект: {mStats.intellect}</p>
            <p>Выносливость: {mStats.stamina}</p>
            <h4>Второстепенные:</h4>
            <p>Сила атаки: {sStats.attackPower}</p>
            <p>Сила заклинаний: {sStats.spellPower}</p>
            <p>Крит: {sStats.crit}</p>
            <p>Броня: {sStats.armor}</p>
            <p>Сопротивление: {sStats.resistance}</p>
            <p>Паррирование: {sStats.parry}</p>
            <p>Уклонение: {sStats.dodge}</p>
            <p>Блок: {sStats.block.toFixed(2)}</p>
            <p>Скорость: {sStats.speed.toFixed(2)}</p>
          </div>
        )}
      </div>
    )
  );
};
