import React from 'react';

import { Inventory } from '@client/ecs/components/game/item/inventory';
import { usePlayerComponent } from '@client/ui/hooks/component';

import css from './inventory.module.css';
import { BagUI } from '@client/ui/hood/inventory/bag/bag';
import { Modal } from '@client/ui/hood/common/modal';

export const InventoryUI: React.FC<{ onClose: () => void; isOpen: boolean }> = ({ onClose, isOpen }) => {
  const inventory = usePlayerComponent<Inventory>('inventory');

  return (
    <Modal isOpen={isOpen} onClose={onClose} className={css.root}>
      <header>
        <h3>Инвентарь</h3>
      </header>
      <BagUI items={inventory?.items} expanded />
      <div>Gold: {inventory?.gold}</div>
    </Modal>
  );
};
