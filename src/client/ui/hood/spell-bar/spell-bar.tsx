import { PlayerContext } from '@client/ui/context/player.context';
import React, { useContext } from 'react';

import css from './spell-bar.module.css';

export const SpellBar: React.FC = () => {
  const player = useContext(PlayerContext);

  return (
    <div className={css.root}>
      <div className={css['speel-list']}>
        <div className={css.spell}></div>
        <div className={css.spell}></div>
        <div className={css.spell}></div>
        <div className={css.spell}></div>
        <div className={css.spell}></div>
        <div className={css.spell}></div>
        <div className={css.spell}></div>
        <div className={css.spell}></div>
        <div className={css.spell}></div>
        <div className={css.spell}></div>
      </div>
    </div>
  );
};
