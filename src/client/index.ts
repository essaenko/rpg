import { Client } from 'colyseus.js';
import { Game, Scale } from 'phaser';
import { LoginScreen } from './scenes/login-screen/login-screen';
import { Boot } from './scenes/boot/boot';
import { Dummy } from './scenes/dummy/dummy';
import { UIScene } from './scenes/ui/ui';
import Cursor from './assets/cursor/Cursor Default.png';

import Center = Phaser.Scale.Center;

document.addEventListener('DOMContentLoaded', () => {
  const client = new Client(`ws://${location.hostname}:2567`);

  const game = new Game({
    type: Phaser.WEBGL,
    scene: [Boot, UIScene, LoginScreen, Dummy],
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
    callbacks: {
      preBoot: (game) => {
        game.registry.set('client', client);
      },
    },
  });
  game.input.mouse.disableContextMenu();

  if (process.env.NODE_ENV === 'development') {
    (window as any).game = game;
  }

  document.body.style.cursor = `url(${Cursor}), auto`;
});
