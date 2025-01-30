import { Keys, Spells } from './types';

export const DEFAULT_LERP_VALUE = 0.1;
export const DEFAULT_LIGHT_HEX_COLOR = 0xffa500;

export const IN_GAME_DAY_TIME = 1000 * 60 * 60;

export const DEFAULT_KEY_BINDING: Record<Spells, Keys> = {
  [Spells.Spell1]: Keys.KeyQ,
  [Spells.Spell2]: Keys.KeyW,
  [Spells.Spell3]: Keys.KeyE,
  [Spells.Spell4]: Keys.KeyR,
  [Spells.Spell5]: Keys.KeyF,
  [Spells.Spell6]: Keys.Digit1,
  [Spells.Spell7]: Keys.Digit2,
  [Spells.Spell8]: Keys.Digit3,
  [Spells.Spell9]: Keys.Digit4,
  [Spells.Spell10]: Keys.Digit5,
};
