import { Directions } from '@shared/types';

export enum Keys {
  Up = 'up', // W
  Down = 'down', // S
  Right = 'right', // D
  Left = 'left', // A

  Spell1 = 'spell1', // Q
  Spell2 = 'spell2', // E
  Spell3 = 'spell3', // R
  Spell4 = 'spell4', // T
  Spell5 = 'spell5', // F
  Spell6 = 'spell6', // 1
  Spell7 = 'spell7', // 2
  Spell8 = 'spell8', // 3
  Spell9 = 'spell9', // 4
  Spell10 = 'spell10', // 5
}

export type ServerKeyValues = Directions;

export const clientKeyToServerValue = (key: Keys): Directions => {
  switch (key) {
    case Keys.Up:
      return Directions.Forward;
    case Keys.Down:
      return Directions.Backward;
    case Keys.Left:
      return Directions.Left;
    case Keys.Right:
      return Directions.Right;
  }
};

export const isKeyOf = (key: string | number | symbol, target: any): key is keyof typeof target => {
  return key in target;
};
