import React, { useMemo } from 'react';

import css from './spell-bar.module.css';
import { SettingsService } from '@client/services/settings';
import { SpellBook } from '@client/ecs/components/game/spells/spell-book';
import { SpellCell } from './spell-cell';
import { usePlayerComponent } from '@client/ui/hooks/component';

export const SpellBar: React.FC = () => {
  const binds = useMemo(() => SettingsService.instance().getSetting('bindings'), []);
  const book = usePlayerComponent<SpellBook>('spell-book');
  const spells = useMemo(() => new Map(book?.spells.entries() ?? []), [book]);

  return (
    <div className={css.root}>
      <div className={css['speel-list']}>
        {(Object.entries(binds) ?? new Array(10).fill(null)).map((bind = [], index) => {
          return <SpellCell key={index} cell={bind[0]} keyBind={bind[1]} />;
        })}
      </div>
    </div>
  );
};
