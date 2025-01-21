import { Boot } from '@client/scenes/boot/boot';
import { Dummy } from '@client/scenes/dummy/dummy';
import { LoginScreen } from '@client/scenes/login-screen/login-screen';
import { UIScene } from '@client/scenes/ui/ui';
import { Client } from 'colyseus.js';
import { Scale, Game } from 'phaser';
import React, { useEffect, useMemo, useState } from 'react';
import Cursor from '@client/assets/cursor/Cursor Default.png';

import Center = Phaser.Scale.Center;
import { ClientContext } from './context/client.context';
import { RoomContext } from './context/room.context';
import { PlayerContext } from './context/player.context';
import { Room } from 'colyseus.js';
import { Entity } from '@client/core/ecs/entity/entity';
import { StatusBar } from './hood/status-bar/status-bar';
import { SpellBar } from './hood/spell-bar/spell-bar';
import { LootUI } from './hood/loot/loot';
import { Controlls } from './hood/controlls/controlls';
import { QuestRequestUI } from './hood/quest/quest-request';

export const GameComponent: React.FC = () => {
  const client = useMemo(() => {
    return new Client(`ws://${location.hostname}:2567`);
  }, [location.hostname]);
  const [room, setRoom] = useState<Room>(null);
  const [player, setPlayer] = useState<Entity>(null);

  const config = useMemo(
    () => ({
      type: Phaser.WEBGL,
      scene: [Boot, LoginScreen, Dummy],
      parent: '#game-root',
      physics: {
        default: 'arcade',
      },
      width: window.innerWidth,
      height: window.innerHeight,
      antialias: true,
      pixelArt: true,
      scale: {
        mode: Scale.FIT,
        autoCenter: Center.CENTER_BOTH,
      },
      fps: {
        min: 30,
      },
      callbacks: {
        preBoot: (game: Game) => {
          game.registry.set('client', client);
        },
      },
    }),
    [client],
  );

  useEffect(() => {
    const game = new Game(config);
    game.input.mouse.disableContextMenu();
    if (process.env.NODE_ENV === 'development') {
      (window as any).game = game;
    }

    const onDataSet = (_: Game, key: string, value: any) => {
      if (key === 'player') {
        setPlayer(value);
      }

      if (key === 'room') {
        setRoom(value);
      }
    };

    game.registry.events.on('setdata', onDataSet);

    document.body.style.cursor = `url(${Cursor}), auto`;

    return () => {
      game.destroy(true);
    };
  }, []);

  useEffect(() => {
    console.log(player?.componentsCount);
  }, [player?.componentsCount]);

  return (
    <ClientContext.Provider value={client}>
      <RoomContext.Provider value={room}>
        <PlayerContext.Provider value={player}>
          <StatusBar />
          <SpellBar />
          <LootUI />
          <Controlls />
          <QuestRequestUI />
        </PlayerContext.Provider>
      </RoomContext.Provider>
    </ClientContext.Provider>
  );
};
