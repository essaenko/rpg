import { Directions, SpellBinding } from '@shared/types';

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

export type ServerKeyValues = Directions | SpellBinding;

export const clientKeyToServerValue = (key: Keys): ServerKeyValues => {
  switch (key) {
    case Keys.Up:
      return Directions.Forward;
    case Keys.Down:
      return Directions.Backward;
    case Keys.Left:
      return Directions.Left;
    case Keys.Right:
      return Directions.Right;
    case Keys.Spell1:
      return SpellBinding.Spell1;
    case Keys.Spell2:
      return SpellBinding.Spell2;
    case Keys.Spell3:
      return SpellBinding.Spell3;
    case Keys.Spell4:
      return SpellBinding.Spell4;
    case Keys.Spell5:
      return SpellBinding.Spell5;
    case Keys.Spell6:
      return SpellBinding.Spell6;
    case Keys.Spell7:
      return SpellBinding.Spell7;
    case Keys.Spell8:
      return SpellBinding.Spell8;
    case Keys.Spell9:
      return SpellBinding.Spell9;
    case Keys.Spell10:
      return SpellBinding.Spell10;
  }
};

export const isKeyOf = (key: string | number | symbol, target: any): key is keyof typeof target => {
  return key in target;
};
