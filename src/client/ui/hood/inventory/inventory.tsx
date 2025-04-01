import React from 'react';

import { Inventory } from '@client/ecs/components/game/item/inventory';
import { usePlayerComponent } from '@client/ui/hooks/component';

import css from './inventory.module.css';

export const InventoryUI: React.FC = () => {
  const inventory = usePlayerComponent<Inventory>('inventory')

  return (
    <div className={css.root}>
      <h3>Inventory</h3>
      <div className={css.list}>
        {inventory?.items.map((stack) => {
          return (
            <div key={stack.item.id}>
              {stack.item.name} - x{stack.amount}
            </div>
          );
        })}
      </div>
      <div>Gold: {inventory?.gold}</div>
    </div>
  );
};
