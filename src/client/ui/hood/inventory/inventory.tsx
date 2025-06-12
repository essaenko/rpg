import React from 'react';

import { Inventory } from '@client/ecs/components/game/item/inventory';
import { usePlayerComponent } from '@client/ui/hooks/component';

import css from './inventory.module.css';
import { BagUI } from '@client/ui/hood/inventory/bag/bag';

export const InventoryUI: React.FC = () => {
  const inventory = usePlayerComponent<Inventory>('inventory');

  return (
    <div className={css.root}>
      <h3>Инвентарь</h3>
      <BagUI items={inventory?.items} expanded />
      <div>Gold: {inventory?.gold}</div>
    </div>
  );
};
