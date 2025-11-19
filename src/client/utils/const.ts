import { Keys, SpellPanel } from './types';

export const DEFAULT_LERP_VALUE = 0.15;
export const DEFAULT_LIGHT_HEX_COLOR = 0xffa500;
export const SERVER_POSITION_TOLERANCE = 8;

export const DEFAULT_KEY_BINDING: Record<Keys, SpellPanel> = {
  [Keys.KeyQ]: SpellPanel.Spell1,
  [Keys.KeyW]: SpellPanel.Spell2,
  [Keys.KeyE]: SpellPanel.Spell3,
  [Keys.KeyR]: SpellPanel.Spell4,
  [Keys.KeyT]: SpellPanel.Spell5,
  [Keys.KeyF]: SpellPanel.Spell6,
  [Keys.Digit1]: SpellPanel.Spell7,
  [Keys.Digit2]: SpellPanel.Spell8,
};

export const COLORS = {
  Rage: 0xff4500,
  Energy: 0xffa500,
  Mana: 0x4682b4,
} as const;
