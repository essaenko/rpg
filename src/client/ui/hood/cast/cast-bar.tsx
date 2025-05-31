import React from 'react';

import { usePlayerComponentState } from '@client/ui/hooks/component';

import css from './cast-bar.module.css';
import { Channeling } from '@client/ecs/components/game/spells/channeling';

export const CastBar: React.FC = () => {
  const channeling = usePlayerComponentState<Channeling>('channeling');

  return channeling && <div className={css.root}>
    <div className={css.fill} style={{width: `${(channeling.spell.castTime - channeling.remains)/channeling.spell.castTime * 100}%`}} />
  </div>;
}