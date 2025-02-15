import { QuestDialog } from '@client/ecs/components/game/ui/quest-dialog';
import { PlayerContext } from '@client/ui/context/player.context';
import { QuestRewardTypes } from '@shared/schemas/game/quest/quest-reward';
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import css from './quest.module.css';
import { RoomContext } from '@client/ui/context/room.context';
import { TransportEventTypes } from '@shared/types';
import { Name } from '@client/ecs/components/game/ui/name';
import { Quest } from '@shared/schemas/game/quest/quest';

export const QuestRequestUI: React.FC = () => {
  const player = useContext(PlayerContext);
  const room = useContext(RoomContext);
  const [dialog, setDialog] = useState<QuestDialog>(null);
  const [selectedQuest, setSelectedQuest] = useState<Quest>(null);
  const npc = useMemo(() => dialog?.giver, [dialog]);

  useEffect(() => {
    if (player?.has('quest-dialog')) {
      setDialog(player.get<QuestDialog>('quest-dialog'));
    }

    if (player) {
      const onComponentsChange = () => {
        setDialog(player.get<QuestDialog>('quest-dialog') ?? null);
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
      room.send(TransportEventTypes.AcceptQuest, [dialog.giver.id, selectedQuest?.id]);
      player.remove('quest-dialog');
    }
    setSelectedQuest(null);
  }, [room, dialog, selectedQuest]);

  const onComplete = useCallback(() => {
    if (room) {
      room.send(TransportEventTypes.CompleteQuest, [selectedQuest.id]);
      player.remove('quest-dialog');
    }
    setSelectedQuest(null);
  }, [room, dialog, selectedQuest]);

  const onClose = useCallback(() => {
    if (player) {
      player.remove('quest-dialog');
    }
    setSelectedQuest(null);
  }, [player]);

  const QuestUI = (
    <>
      <h4>{selectedQuest?.name}</h4>
      <div>{selectedQuest?.description}</div>
      <div>{selectedQuest?.short_description}</div>
      <div>
        {selectedQuest?.rewards.map((reward) => {
          return (
            <div key={reward.type}>
              {reward.type === QuestRewardTypes.Gold ? `Золото: ${reward.amount}` : null}
              {reward.type === QuestRewardTypes.Exp ? `Опыт: ${reward.amount}` : null}
            </div>
          );
        })}
      </div>
      <div>
        <button onClick={onClose}>Отказаться</button>
        {dialog?.finished.includes(selectedQuest) && <button onClick={onComplete}>Завершить</button>}
        {dialog?.list.includes(selectedQuest) && <button onClick={onAccept}>Принять</button>}
      </div>
    </>
  );

  const QuestsUI = (
    <div>
      {dialog?.finished.map((quest) => {
        return (
          <div key={quest.id} onClick={() => setSelectedQuest(quest)}>
            [+] {quest.name}
          </div>
        );
      })}
      {dialog?.list.map((quest) => {
        return (
          <div key={quest.id} onClick={() => setSelectedQuest(quest)}>
            {quest.name}
          </div>
        );
      })}
    </div>
  );

  return dialog ? (
    <div className={css['quest-dialog']}>
      <header>
        <h3>{npc?.get<Name>('name')?.value ?? 'Unknown'}</h3>
      </header>
      <section>{selectedQuest ? QuestUI : QuestsUI}</section>
      <footer>
        <button onClick={onClose}>Закрыть</button>
      </footer>
    </div>
  ) : null;
};
