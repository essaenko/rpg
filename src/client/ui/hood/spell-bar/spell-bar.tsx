import { PlayerContext } from '@client/ui/context/player.context';
import React, { useContext, useEffect, useMemo, useState } from 'react';

import css from './spell-bar.module.css';
import { SettingsService } from '@client/services/settings';
import { SpellBook } from '@client/ecs/components/game/spells/spell-book';
import { Spell } from '@shared/schemas/game/spell/spell';
import { SpellCell } from './spell-cell';
import { usePlayerComponent } from '@client/ui/hooks/component';

export const SpellBar: React.FC = () => {
  const binds = useMemo(() => SettingsService.instance().getSetting('bindings'), []);
  const book = usePlayerComponent<SpellBook>('spell-book')
  const spells = useMemo(() => new Map(book?.spells.entries() ?? []), [book]);

  return (
    <div className={css.root}>
      <div className={css['speel-list']}>
        {(Object.entries(binds) ?? new Array(10).fill(null)).map((bind = [], index) => {
          return <SpellCell key={index} schema={spells?.get(bind[0])} keyBind={bind[1]} />;
        })}
      </div>
    </div>
  );
};
