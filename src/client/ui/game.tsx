import { Boot } from '@client/scenes/boot/boot';
import { LoginScreen } from '@client/scenes/login-screen/login-screen';
import { Client } from 'colyseus.js';
import { Scale, Game } from 'phaser';
import React, { useEffect, useMemo, useState } from 'react';
import Cursor from '@client/assets/cursor/Cursor Default.png';

import Center = Phaser.Scale.Center;
import { PlayerContext } from './context/player.context';
import { Entity } from '@client/core/ecs/entity/entity';
import { StatusBar } from './hood/status-bar/status-bar';
import { SpellBar } from '@client/ui/hood/spells/spell-bar/spell-bar';
import { LootUI } from '@client/ui/hood/inventory/loot/loot';
import { Controlls } from './hood/controlls/controlls';
import { QuestRequestUI } from './hood/quest/quest-dialog';
import { MainMenu } from './menu/main';
import { QuestBookUI } from '@client/ui/hood/quest/quest-book';
import { Networking } from '@client/services/networking';
import { CastBar } from '@client/ui/hood/cast/cast-bar';
import { Resurrection } from '@client/ui/hood/resurrection/resurrection';

export const GameComponent: React.FC = () => {
  const [player, setPlayer] = useState<Entity>(null);
  const [connected, setConnected] = useState(false);

  const config = useMemo(
    () => ({
      type: Phaser.WEBGL,
      scene: [Boot],
      parent: '#game-root',
      physics: {
        default: 'arcade',
      },
      width: window.innerWidth,
      height: window.innerHeight,
      antialias: true,
      autoRound: false,
      pixelArt: true,
      scale: {
        mode: Scale.FIT,
        autoCenter: Center.CENTER_BOTH,
      },
      fps: {
        min: 30,
      },
    }),
    [],
  );

  useEffect(() => {
    Networking.instance.connect();
    setConnected(true);
    const game = new Game(config);
    game.input.mouse.disableContextMenu();
    if (process.env.NODE_ENV === 'development') {
      (window as any).game = game;
    }

    const onDataSet = (_: Game, key: string, value: any) => {
      if (key === 'player') {
        setPlayer(value);
      }
    };

    game.registry.events.on('setdata', onDataSet);
    game.registry.events.on('changedata', onDataSet);

    document.body.style.cursor = `url(${Cursor}), auto`;

    return () => {
      setConnected(false);
      Networking.instance.disconnect();
      game.destroy(true);
    };
  }, []);

  return (
    connected && (
      <PlayerContext.Provider value={player}>
        <Resurrection />
        <StatusBar />
        <SpellBar />
        <LootUI />
        <Controlls />
        <QuestRequestUI />
        <QuestBookUI />
        <MainMenu />
        <CastBar />
      </PlayerContext.Provider>
    )
  );
};
