import { Loot } from '@client/ecs/components/game/item/loot';
import { PlayerContext } from '@client/ui/context/player.context';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import css from './loot.module.css';
import { RoomContext } from '@client/ui/context/room.context';
import { TransportEventTypes } from '@shared/types';
import type { Item } from '@shared/schemas/game/item/item';

export const LootUI: React.FC = () => {
  const player = useContext(PlayerContext);
  const room = useContext(RoomContext);
  const [loot, setLoot] = useState<Item[]>(null);
  const [lc, setLC] = useState<Loot>(null);

  const collectItem = useCallback(
    (id: string) => () => {
      room.send(TransportEventTypes.PickItem, [id]);
    },
    [room],
  );

  useEffect(() => {
    const onComponentAdd = () => {
      if (player?.has('loot')) {
        setLC(player.get<Loot>('loot'));
        setLoot(player.get<Loot>('loot').items);
      }
    };
    const onComponentRemove = () => {
      if (!player?.has('loot')) {
        setLC(null);
        setLoot(null);
      }
    };

    player?.on('entity:components:add', onComponentAdd);
    player?.on('entity:components:remove', onComponentRemove);

    return () => {
      player?.detach('entity:components:add', onComponentAdd);
      player?.detach('entity:components:remove', onComponentRemove);
    };
  }, [player]);

  useEffect(() => {
    if (lc) {
      const onComponentChange = () => {
        setLoot([...lc.items]);
      };
      lc.on('component:change', onComponentChange);

      return () => {
        lc.detach('component:change', onComponentChange);
      };
    }
  }, [lc]);

  return lc?.items.length ? (
    <div className={css.root}>
      <div className={css.list}>
        {loot.map((item) => {
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
