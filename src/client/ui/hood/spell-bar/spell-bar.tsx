import React, { useMemo } from 'react';

import css from './spell-bar.module.css';
import { SettingsService } from '@client/services/settings';
import { SpellBook } from '@client/ecs/components/game/spells/spell-book';
import { SpellCell } from './spell-cell';
import { usePlayerComponent } from '@client/ui/hooks/component';
import { Level } from '@client/ecs/components/game/mechanics/level';
import { useSchemaState } from '@client/ui/hooks/schema';
import { LVL_CAPS } from '@shared/utils/level';

export const SpellBar: React.FC = () => {
  const binds = useMemo(() => SettingsService.instance().getSetting('bindings'), []);
  const level = usePlayerComponent<Level>('level');

  return (
    <div className={css.root}>
      {level && (
        <div className={css['exp-bar']}>
          <div className={css['exp-filler']} style={{ width: `${level.exp / LVL_CAPS[level.level - 1] * 100}%` }} />
        </div>
      )}
      <div className={css['speel-list']}>
        {(Object.entries(binds) ?? new Array(10).fill(null)).map((bind = [], index) => {
          return <SpellCell key={index} cell={bind[0]} keyBind={bind[1]} />;
        })}
      </div>
    </div>
  );
};
