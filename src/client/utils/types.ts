import Phaser from 'phaser';
import type { Pointer2D } from '@shared/types';

import CursorDefault from '@client/assets/cursor/Cursor Default.png';
import CursorLoot from '@client/assets/cursor/Cursor Mini Build Green.png';
import CursorQuestComplete from '@client/assets/cursor/Cursor Mini Question Yellow.png';
import CursorQuestAwailable from '@client/assets/cursor/Cursor Mini Settings Green.png';
import { NonFunctionPropNames } from '@colyseus/schema/lib/types/HelperTypes';

export enum SpellPanel {
  Spell1 = 1,
  Spell2,
  Spell3,
  Spell4,
  Spell5,
  Spell6,
  Spell7,
  Spell8,
}

export enum Keys {
  KeyQ = 'KeyQ',
  KeyW = 'KeyW',
  KeyE = 'KeyE',
  KeyR = 'KeyR',
  KeyF = 'KeyF',
  KeyT = 'KeyT',
  KeyS = 'KeyS',
  Digit1 = 'Digit1',
  Digit2 = 'Digit2',
}

export const isKeyOf = <T extends object>(key: unknown, target: any): key is keyof T => {
  return (typeof key === 'string' || typeof key === 'number' || typeof key === 'symbol') && key in target;
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

export type WithArcadeBody<G extends Phaser.GameObjects.GameObject> = G & Phaser.Physics.Arcade.Body;

export const isNonFunctionProperty = <T extends unknown>(key: unknown, el: T): key is NonFunctionPropNames<T> => {
  return typeof key != null && typeof el === 'object' && isKeyOf(key, el) && typeof el[key as keyof T] !== 'function';
};

export type SingleSpriteAsset = {
  key: string;
  asset: string;
  type: 'sprite';
  config: {
    frameWidth: number;
    frameHeight: number;
  };
};

export type MultipleSpriteAsset = {
  key: string;
  type: 'multiple';
  frames: MultipleSpriteAssetFrame[];
};

export type MultipleSpriteAssetFrame = {
  id: number;
  asset: string;
  config: {
    frameWidth: number;
    frameHeight: number;

    light?: Pointer2D;
  };
};

export type MapPackage = {
  map: {
    key: string;
    asset: string;
  };
  assets: (SingleSpriteAsset | MultipleSpriteAsset)[];
};

export const isSingleSpriteAsset = (asset: unknown): asset is SingleSpriteAsset => {
  return typeof asset === 'object' && 'type' in asset && asset.type === 'sprite';
};

export const isMultipleSpriteAsset = (asset: unknown): asset is MultipleSpriteAsset => {
  return typeof asset === 'object' && 'type' in asset && asset.type === 'multiple';
};
