import React, { useMemo } from 'react';

import css from './spell-bar.module.css';
import { SettingsService } from '@client/services/settings';
import { SpellCell } from './spell-cell';
import { usePlayerComponentState } from '@client/ui/hooks/component';
import { Level } from '@client/ecs/components/game/mechanics/level';
import { LVL_CAPS } from '@shared/utils/level';
import { Keys } from '@client/utils/types';

export const SpellBar: React.FC = () => {
  const binds = useMemo(() => SettingsService.instance().getSetting('bindings'), []);
  const level = usePlayerComponentState<Level>('level');

  return (
    <div className={css.root}>
      <div className={css.passives}>
        <div className={css['passive-spell']}></div>
        <div className={css['passive-spell']}></div>
        <div className={css['passive-spell']}></div>
      </div>
      {level && (
        <div className={css['exp-bar']}>
          <div className={css['exp-filler']} style={{ width: `${(level.exp / LVL_CAPS[level.level - 1]) * 100}%` }} />
        </div>
      )}
      <div className={css['speel-list']}>
        <SpellCell key={1} cell={null} keyBind={Keys.KeyQ} />
        <SpellCell key={1} cell={null} keyBind={Keys.KeyW} />
        <SpellCell key={1} cell={null} keyBind={Keys.KeyE} />
        <SpellCell key={1} cell={null} keyBind={Keys.KeyR} />
        <div className={css.separator}></div>
        <SpellCell key={1} cell={null} keyBind={Keys.KeyT} />
        <SpellCell key={1} cell={null} keyBind={Keys.KeyF} />
        <div className={css.separator}></div>
        <SpellCell key={1} cell={null} keyBind={Keys.Digit1} />
        <SpellCell key={1} cell={null} keyBind={Keys.Digit2} />
      </div>
    </div>
  );
};
