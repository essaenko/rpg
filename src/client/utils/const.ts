import { Keys, SpellPanel } from './types';

export const DEFAULT_LERP_VALUE = 0.15;
export const DEFAULT_LIGHT_HEX_COLOR = 0xffa500;
export const SERVER_POSITION_TOLERANCE = 8;

export const IN_GAME_DAY_TIME = 1000 * 60 * 30;

export const DEFAULT_KEY_BINDING: Record<SpellPanel, Keys> = {
  [SpellPanel.Spell1]: Keys.KeyQ,
  [SpellPanel.Spell2]: Keys.KeyW,
  [SpellPanel.Spell3]: Keys.KeyE,
  [SpellPanel.Spell4]: Keys.KeyR,
  [SpellPanel.Spell5]: Keys.KeyF,
  [SpellPanel.Spell6]: Keys.Digit1,
  [SpellPanel.Spell7]: Keys.Digit2,
  [SpellPanel.Spell8]: Keys.Digit3,
  [SpellPanel.Spell9]: Keys.Digit4,
  [SpellPanel.Spell10]: Keys.Digit5,
};

export const COLORS = {
  Rage: 0xff4500,
  Energy: 0xffa500,
  Mana: 0x4682b4,
} as const;