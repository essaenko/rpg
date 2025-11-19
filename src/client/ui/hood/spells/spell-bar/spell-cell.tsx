import React, { useMemo } from 'react';

import css from './spell-bar.module.css';
import { Tooltip } from '@client/ui/utils/tooltip';
import { SpellIcons } from '@client/assets/images/icons/map';
import { useSchemaState } from '@client/ui/hooks/schema';
import { Keys, SpellPanel } from '@client/utils/types';
import { InputService } from '@client/services/input';
import { usePlayerComponent } from '@client/ui/hooks/component';
import { SpellBook } from '@client/ecs/components/game/spells/spell-book';
import { SpellTooltip } from '@client/ui/hood/spells/spell-tooltip/spell-tooltip';

export const SpellCell = ({ keyBind }: { cell: SpellPanel | null; keyBind: Keys }) => {
  const bind = useMemo(() => InputService.instance().getSpellBinding(keyBind), [keyBind]);
  const book = usePlayerComponent<SpellBook>('spell-book');
  const spell = useSchemaState(book?.spells.get(bind?.toString()));

  return (
    <div className={css.spell}>
      <span className={css.key}>{keyBindToChar(keyBind)}</span>
      {spell && (
        <Tooltip className={css.tooltip} tooltip={<SpellTooltip spell={spell} />}>
          <div
            className={css.cooldown_hover}
            style={{ height: `${((spell.cooldownTime ?? 0) / spell.cooldown) * 100}%` }}
          />
          <img src={SpellIcons[spell.id]} alt="" />
        </Tooltip>
      )}
    </div>
  );
};

const keyBindToChar = (key: Keys): string => {
  switch (key) {
    case Keys.KeyQ:
      return 'Q';
    case Keys.KeyW:
      return 'W';
    case Keys.KeyE:
      return 'E';
    case Keys.KeyR:
      return 'R';
    case Keys.KeyT:
      return 'T';
    case Keys.KeyF:
      return 'F';
  }
};
