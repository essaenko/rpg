import React from 'react';

import { GameComponent } from './game';
import css from './index.module.css';

export const GameUI: React.FC = () => {
  return (
    <div className={css.root}>
      <GameComponent />
    </div>
  );
};
