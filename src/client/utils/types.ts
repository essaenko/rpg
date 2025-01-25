import { Directions } from '@shared/types';

import CursorDefault from '@client/assets/cursor/Cursor Default.png';
import CursorLoot from '@client/assets/cursor/Cursor Mini Build Green.png';
import CursorQuestComplete from '@client/assets/cursor/Cursor Mini Question Yellow.png';
import CursorQuestAwailable from '@client/assets/cursor/Cursor Mini Settings Green.png';

export enum Spells {
  Spell1 = 1,
  Spell2,
  Spell3,
  Spell4,
  Spell5,
  Spell6,
  Spell7,
  Spell8,
  Spell9,
  Spell10,
}

export enum Keys {
  KeyQ = 'KeyQ',
  KeyW = 'KeyW',
  KeyE = 'KeyE',
  KeyR = 'KeyR',
  KeyF = 'KeyF',
  Digit1 = 'Digit1',
  Digit2 = 'Digit2',
  Digit3 = 'Digit3',
  Digit4 = 'Digit4',
  Digit5 = 'Digit5',
}

export const isKeyOf = (key: string | number | symbol, target: any): key is keyof typeof target => {
  return key in target;
};

export enum QuestGiverStates {
  QuestAvailable = 1,
  QuestFinished,
  QuestUnawailable,
  QuestInProgress,
}

export enum Cursors {
  Default = CursorDefault,
  Loot = CursorLoot,
  AwailableQiest = CursorQuestAwailable,
  CompletedQuest = CursorQuestComplete,
}
