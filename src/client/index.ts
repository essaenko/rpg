import { Client } from 'colyseus.js';
import { AUTO, Game, Scale } from 'phaser';
import { LoginScreen } from './scenes/login-screen/login-screen';
import { Boot } from './scenes/boot/boot';
import { InitUI } from './ui/init';
import { BehaviorSubject } from 'rxjs';
import { Dummy } from './scenes/dummy/dummy';

document.addEventListener('DOMContentLoaded', () => {
  const client = new Client('ws://localhost:2567');
  client.getAvailableRooms();

  const game = new Game({
    type: AUTO,
    scene: [Boot, LoginScreen, Dummy],
    parent: '#game-root',
    physics: {
      default: 'arcade',
    },
    width: 1280,
    height: 720,
    antialias: false,
    pixelArt: true,
    // roundPixels: true,
    scale: {
      mode: Scale.ScaleModes.ENVELOP,
      min: {
        width: 1280,
        height: 720,
      },
      max: {
        width: 2560,
        height: 1440,
      },
    },
    callbacks: {
      preBoot: (game) => {
        game.registry.set('client', client);
      },
    },
  });
  const sceneSubj = new BehaviorSubject('');
  game.input.mouse.disableContextMenu();
  game.registry.events.on('changedata-scene', (_: Game, v: string) => {
    sceneSubj.next(v);
  });
  InitUI({
    scene: sceneSubj,
  });

  if (process.env.NODE_ENV === 'development') {
    (window as any).game = game;
  }
});
