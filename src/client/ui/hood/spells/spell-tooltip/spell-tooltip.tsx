import { Spell } from '@shared/schemas/game/spell/spell';
import css from '@client/ui/hood/spells/spell-tooltip/spell-tooltip.module.css';
import React from 'react';

export const SpellTooltip = ({ spell }: { spell: Spell }) => {
  return (
    <div className={css.root}>
      <div>
        <h2 className={css.spell_name}>{spell.name}</h2>
        <p className={css.spell_description}>{spell.description}</p>
        {(spell.castTime || null) && <p>Время произнесения: {spell.castTime / 1000} сек.</p>}
        <span>Перезарядка: {spell.cooldown / 1000} сек.</span>
      </div>
    </div>
  );
};
