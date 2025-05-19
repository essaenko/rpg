import React, { useCallback, useContext } from 'react';

import { Loot } from '@client/ecs/components/game/item/loot';
import { TransportEventTypes } from '@shared/types';
import { usePlayerComponent } from '@client/ui/hooks/component';

import css from './loot.module.css';
import { Networking } from '@client/services/networking';
export const LootUI: React.FC = () => {
  const loot = usePlayerComponent<Loot>('loot');
  const room = Networking.instance.room;

  const collectItem = useCallback(
    (id: string) => () => {
      room.send(TransportEventTypes.PickItem, [id]);
    },
    [room],
  );

  return loot?.items.length ? (
    <div className={css.root}>
      <div className={css.list}>
        {loot.items.map((item) => {
          return (
            <div className={css.item} key={item.id} onClick={collectItem(item.id)}>
              {item.name}
            </div>
          );
        })}
      </div>
    </div>
  ) : null;
};
