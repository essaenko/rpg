import React from 'react';
import { Modal } from '@client/ui/hood/common/modal';

import css from './spell-book.module.css';
import { usePlayerComponentState } from '@client/ui/hooks/component';
import type { Spell } from '@shared/schemas/game/spell/spell';
import { SpellBook } from '@client/ecs/components/game/spells/spell-book';
import { SpellIcons } from '@client/assets/images/icons/map';
import { COMMON_SPELLS } from '@shared/utils/const';
import { Tooltip } from '@client/ui/utils/tooltip';
import { SpellTooltip } from '@client/ui/hood/spells/spell-tooltip/spell-tooltip';

export const SpellBookUI: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ onClose, isOpen }) => {
  const spellBook = usePlayerComponentState<SpellBook>('spell-book');

  return (
    <Modal isOpen={isOpen} onClose={onClose} className={css.root}>
      <header>
        <h3>Способности</h3>
        <div className={css.list}>
          {Array.from(spellBook?.spells?.values() ?? [])
            .filter(({ id }) => !COMMON_SPELLS.has(id))
            .map((spell) => (
              <div key={spell.id} className={css.spell}>
                <Tooltip tooltip={<SpellTooltip spell={spell} />}>
                  <div className={css.spell_icon}>
                    <img src={SpellIcons[spell.id]} alt="" />
                  </div>
                </Tooltip>
                <span>{spell.name}</span>
              </div>
            ))}
        </div>
      </header>
    </Modal>
  );
};
