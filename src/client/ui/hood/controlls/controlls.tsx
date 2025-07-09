import React, { useState } from 'react';

import css from './controlls.module.css';
import { InventoryUI } from '../inventory/inventory';
import { SpellBookUI } from '@client/ui/hood/spells/spell-book/spell-book';

export const Controlls: React.FC = () => {
  const [isInventoryOpen, setIsInventoryOpen] = useState<boolean>(false);
  const [isSpellBookOpen, setIsSpellBookOpen] = useState<boolean>(false);

  return (
    <div className={css.root}>
      <div className={css.list}>
        <button onClick={() => setIsInventoryOpen(!isInventoryOpen)}>Инвентарь</button>
        <button onClick={() => setIsSpellBookOpen(!isSpellBookOpen)}>Способности</button>
      </div>

      <InventoryUI onClose={() => setIsInventoryOpen(false)} isOpen={isInventoryOpen} />
      <SpellBookUI onClose={() => setIsSpellBookOpen(false)} isOpen={isSpellBookOpen} />
    </div>
  );
};
