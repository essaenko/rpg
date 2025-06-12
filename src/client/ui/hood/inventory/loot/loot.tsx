import React, { useCallback, useContext } from 'react';

import { Loot } from '@client/ecs/components/game/item/loot';
import { TransportEventTypes } from '@shared/types';
import { usePlayerComponent } from '@client/ui/hooks/component';

import css from './loot.module.css';
import { Networking } from '@client/services/networking';
import { BagUI } from '@client/ui/hood/inventory/bag/bag';
import type { Stack } from '@shared/schemas/game/item/item';

export const LootUI: React.FC = () => {
  const loot = usePlayerComponent<Loot>('loot');
  const room = Networking.instance.room;

  const collectItem = useCallback(
    (stack: Stack) => {
      room.send(TransportEventTypes.PickItem, [stack.item.id]);
    },
    [room],
  );

  return loot?.items.length ? (
    <div className={css.root}>
      <h3>Добыча</h3>
      <BagUI items={loot.items} onClick={collectItem} />
    </div>
  ) : null;
};
