import React, { useCallback, useContext } from 'react';

import { Loot } from '@client/ecs/components/game/item/loot';
import { RoomContext } from '@client/ui/context/room.context';
import { TransportEventTypes } from '@shared/types';
import { usePlayerComponent } from '@client/ui/hooks/component';

import css from './loot.module.css';
export const LootUI: React.FC = () => {
  const room = useContext(RoomContext);
  const loot = usePlayerComponent<Loot>('loot');

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
