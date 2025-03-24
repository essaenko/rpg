import { PlayerContext } from '@client/ui/context/player.context';
import React, { useContext, useEffect, useState } from 'react';
import css from './quest.module.css';
import { QuestBook } from '@client/ecs/components/game/quest/quest-book';

export const QuestBookUI: React.FC = () => {
  const player = useContext(PlayerContext);
  const [book, setBook] = useState<Pick<QuestBook, 'name' | 'finished' | 'ongoing'> | null>(null);

  useEffect(() => {
    const getBookComponent = () => {
      const b = player?.get<QuestBook>('quest-book');

      if (b) {
        setBook({ ...b });
        b.on('component:change', () => {
          setBook({ ...b });
        })
      }
    }
    getBookComponent();

    player?.on('entity:components:add', getBookComponent);
    return () => {
      player?.detach('entity:components:add', getBookComponent);
    }
  }, [player]);


  return <div className={css.book}>
    <h3>
      Задания
    </h3>
    <ul>
      <li>
        <h5>Заголовок</h5>
        <p>Описание</p>
      </li>
    </ul>
  </div>;
};
