import React, { useState } from 'react';

import css from './controlls.module.css';
import { InventoryUI } from './inventory';

export const Controlls: React.FC = () => {
  const [isInventoryOpen, setIsInventoryOpen] = useState<boolean>(false);
  return (
    <div className={css.root}>
      <button onClick={() => setIsInventoryOpen(!isInventoryOpen)}>Инвентарь</button>

      {isInventoryOpen ? <InventoryUI /> : null}
    </div>
  );
};
