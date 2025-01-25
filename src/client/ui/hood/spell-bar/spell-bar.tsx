import { PlayerContext } from '@client/ui/context/player.context';
import React, { useContext, useEffect, useMemo, useState } from 'react';

import css from './spell-bar.module.css';
import { SettingsService } from '@client/services/settings';
import { DEFAULT_KEY_BINDING } from '@client/utils/const';
import { SpellBook } from '@client/ecs/components/game/spells/spell-book';
import { Tooltip } from '@client/ui/utils/tooltip';
import { Spell } from '@shared/schemas/game/spell/spell';
import { SpellIcons } from '@client/assets/images/icons/map';

export const SpellBar: React.FC = () => {
  const player = useContext(PlayerContext);
  const binds = useMemo(() => SettingsService.instance().getSetting('bindings') ?? DEFAULT_KEY_BINDING, []);
  const spellBind = useMemo(() => SettingsService.instance().getSetting('spell-binding'), []);
  const book = useMemo(() => player?.get<SpellBook>('spell-book'), [player]);
  const [update, setUpdate] = useState<number>(0);

  useEffect(() => {
    book?.spells.forEach((spell) => {
      const callback = () => {
        setUpdate(update + 1);
      };

      spell.onChange(callback);

      return callback;
    });
  }, [book, update]);

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
        <div className={css.spell}>
          {book?.spells.at(0) && (
            <Tooltip className={css.spell_tooltip} tooltip={<SpellTooltip spell={book.spells.at(0)} />}>
              <div
                className={css.cooldown_hover}
                style={{ height: `${(book.spells.at(0).cooldownTime ?? 0 / book.spells.at(0).cooldown) * 100}%` }}
              />
              <img src={SpellIcons[book.spells.at(0).id]} alt="" />
            </Tooltip>
          )}
        </div>
        <div className={css.spell}></div>
        <div className={css.spell}></div>
        <div className={css.spell}></div>
        <div className={css.spell}></div>
        <div className={css.spell}></div>
        <div className={css.spell}></div>
        <div className={css.spell}></div>
        <div className={css.spell}></div>
        <div className={css.spell}></div>
      </div>
    </div>
  );
};
