import { QuestRequest } from '@client/ecs/components/game/ui/quest-request';
import { PlayerContext } from '@client/ui/context/player.context';
import { QuestRewardTypes } from '@shared/schemas/game/quest/quest-reward';
import React, { useCallback, useContext, useEffect, useState } from 'react';

import css from './quest.module.css';
import { RoomContext } from '@client/ui/context/room.context';
import { TransportEventTypes } from '@shared/types';

export const QuestRequestUI: React.FC = () => {
  const player = useContext(PlayerContext);
  const room = useContext(RoomContext);
  const [request, setRequest] = useState<QuestRequest>(null);

  useEffect(() => {
    if (player?.has('quest-request')) {
      setRequest(player.get<QuestRequest>('quest-request'));
    }

    if (player) {
      const onComponentsChange = () => {
        setRequest(player.get<QuestRequest>('quest-request') ?? null);
      };

      player.on('entity:components:add', onComponentsChange);
      player.on('entity:components:remove', onComponentsChange);

      return () => {
        player.detach('entity:components:add', onComponentsChange);
        player.detach('entity:components:remove', onComponentsChange);
      };
    }
  }, [player]);

  const onAccept = useCallback(() => {
    if (room) {
      room.send(TransportEventTypes.AcceptQuest, [request.giver, request.quest.id]);
      player.removeComponent('quest-request');
    }
  }, [room, request]);

  const onReject = useCallback(() => {
    if (player) {
      player.removeComponent('quest-request');
    }
  }, [player]);

  return request ? (
    <div className={css['quest-request']}>
      <h3>{request.quest.name}</h3>
      <div>{request.quest.description}</div>
      <div>{request.quest.short_description}</div>
      <div>
        {request.quest.rewards.map((reward) => {
          return (
            <div key={reward.type}>
              {reward.type === QuestRewardTypes.Gold ? `Золото: ${reward.amount}` : null}
              {reward.type === QuestRewardTypes.Exp ? `Опыт: ${reward.amount}` : null}
            </div>
          );
        })}
      </div>
      <div>
        <button onClick={onReject}>Отказаться</button>
        <button onClick={onAccept}>Принять</button>
      </div>
    </div>
  ) : null;
};
