import { Spell } from '@shared/schemas/game/spell/spell';
import React, { useMemo } from 'react';

import css from './spell-bar.module.css';
import { Tooltip } from '@client/ui/utils/tooltip';
import { SpellIcons } from '@client/assets/images/icons/map';
import { useSchemaState } from '@client/ui/hooks/schema';
import { Keys, SpellPanel } from '@client/utils/types';
import { InputService } from '@client/services/input';
import { usePlayerComponent } from '@client/ui/hooks/component';
import { SpellBook } from '@client/ecs/components/game/spells/spell-book';

const SpellTooltip = ({ spell }: { spell: Spell }) => {
  return (
    <div>
      <div>
        <h2 className={css.spell_name}>{spell.name}</h2>
        <p className={css.spell_description}>{spell.description}</p>
        {(spell.castTime || null) && <p>Время произнесения: {spell.castTime / 1000} сек.</p>}
        <span>Перезарядка: {spell.cooldown / 1000} сек.</span>
      </div>
    </div>
  );
};

export const SpellCell = ({ keyBind }: { cell: SpellPanel | null; keyBind: Keys }) => {
  const bind = useMemo(() => InputService.instance().getSpellBinding(keyBind), [keyBind]);
  const book = usePlayerComponent<SpellBook>('spell-book');
  const spell = useSchemaState(book?.spells.get(bind?.toString()));

  return (
    <div className={css.spell}>
      <span className={css.key}>{keyBindToChar(keyBind)}</span>
      {spell && (
        <Tooltip className={css.spell_tooltip} tooltip={<SpellTooltip spell={spell} />}>
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
    case Keys.KeyE:
      return 'E';
    case Keys.KeyF:
      return 'F';
    case Keys.KeyR:
      return 'R';
    case Keys.KeyQ:
      return 'Q';
    case Keys.KeyW:
      return 'W';
    case Keys.Digit1:
      return '1';
    case Keys.Digit2:
      return '2';
    case Keys.Digit3:
      return '3';
    case Keys.Digit4:
      return '4';
    case Keys.Digit5:
      return '5';
  }
};
