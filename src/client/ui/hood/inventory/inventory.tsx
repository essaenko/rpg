import React, { useContext, useEffect, useState } from 'react';

import css from './inventory.module.css';
import { PlayerContext } from '@client/ui/context/player.context';
import type { Stack } from '@shared/schemas/game/item/item';
import { Inventory } from '@client/ecs/components/game/item/inventory';

export const InventoryUI: React.FC = () => {
  const player = useContext(PlayerContext);
  const [inventory, setInventory] = useState<Stack[]>([]);
  const [gold, setGold] = useState<number>(0);
  const [ic, setIc] = useState<Inventory>(null);

  useEffect(() => {
    if (player?.has('inventory')) {
      const ic = player.get<Inventory>('inventory');
      setIc(ic);
      setInventory([...ic.items]);
      setGold(ic.gold);
    }
  }, [player]);

  useEffect(() => {
    if (ic) {
      const onInventoryChange = () => {
        setInventory([...ic.items]);
      };
      ic.on('component:change', onInventoryChange);

      return () => {
        ic.detach('component:change', onInventoryChange);
      };
    }
  }, [ic]);

  return (
    <div className={css.root}>
      <h3>Inventory</h3>
      <div className={css.list}>
        {inventory.map((stack) => {
          return (
            <div key={stack.item.id}>
              {stack.item.name} - x{stack.amount}
            </div>
          );
        })}
      </div>
      <div>Gold: {gold}</div>
    </div>
  );
};
