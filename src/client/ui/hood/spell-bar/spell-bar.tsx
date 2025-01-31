import { PlayerContext } from '@client/ui/context/player.context';
import React, { useContext, useEffect, useMemo, useState } from 'react';

import css from './spell-bar.module.css';
import { SettingsService } from '@client/services/settings';
import { DEFAULT_KEY_BINDING } from '@client/utils/const';
import { SpellBook } from '@client/ecs/components/game/spells/spell-book';
import { Tooltip } from '@client/ui/utils/tooltip';
import { Spell } from '@shared/schemas/game/spell/spell';
import { SpellIcons } from '@client/assets/images/icons/map';
import { RoomContext } from '@client/ui/context/room.context';
import { getStateCallbacks } from 'colyseus.js';

export const SpellBar: React.FC = () => {
  const player = useContext(PlayerContext);
  const room = useContext(RoomContext);
  const $ = useMemo(() => {
    if (room) {
      return getStateCallbacks(room);
    }

    return null;
  }, [room]);
  const binds = useMemo(() => SettingsService.instance().getSetting('bindings') ?? DEFAULT_KEY_BINDING, []);
  const spellBind = useMemo(() => SettingsService.instance().getSetting('spell-binding'), []);
  const book = useMemo(() => player?.get<SpellBook>('spell-book'), [player]);
  const [spells, setSpells] = useState<Spell[]>([]);

  useEffect(() => {
    if (book) {
      setSpells(Array.from(book.spells.values()));
    }
  }, [book]);

  const SpellTooltip = ({ spell }: { spell: Spell }) => {
    return (
      <div>
        <div>
          <h2 className={css.spell_name}>{spell.name}</h2>
          <p className={css.spell_description}>{spell.description}</p>
          <span>Перезарядка: {spell.cooldown} сек.</span>
        </div>
      </div>
    );
  };

  return (
    <div className={css.root}>
      <div className={css['speel-list']}>
        {spells
          .map((spell) => {
            return spell ? (
              <div className={css.spell}>
                <Tooltip className={css.spell_tooltip} tooltip={<SpellTooltip spell={spell} />}>
                  <div
                    className={css.cooldown_hover}
                    style={{ height: `${(spell.cooldownTime ?? 0 / spell.cooldown) * 100}%` }}
                  />
                  <img src={SpellIcons[spell.id]} alt="" />
                </Tooltip>
              </div>
            ) : null;
          })
          .slice(0, 10)}
      </div>
    </div>
  );
};
