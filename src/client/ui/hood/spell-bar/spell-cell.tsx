import { Spell } from '@shared/schemas/game/spell/spell';
import React, { useContext, useEffect, useMemo, useState } from 'react';

import css from './spell-bar.module.css';
import { Tooltip } from '@client/ui/utils/tooltip';
import { SpellIcons } from '@client/assets/images/icons/map';
import { RoomContext } from '@client/ui/context/room.context';
import { getStateCallbacks } from 'colyseus.js';
import { useSchemaState } from '@client/ui/hooks/schema';

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

export const SpellCell = ({ schema, keyBind }: { schema: Spell | null; keyBind: string }) => {
  const spell = useSchemaState(schema);

  return (
    <div className={css.spell}>
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
