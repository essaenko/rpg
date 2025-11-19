import { Class, SpellSlot } from '@shared/types';

export enum Spells {
  Hit = 1,
  Heal,
  Hot,
  Dot,
  Shot,
  SplitFire,

  //Common Spells
  Gather,
  Loot,
}

export type ClassSpellBook = Partial<Record<SpellSlot, Spells>>;

export type ClassSpellUnlock = {
  level: number;
  slot: SpellSlot;
  spell: Spells;
};

export const CLASS_SPELL_UNLOCKS: Record<Class, ClassSpellUnlock[]> = {
  [Class.Warrior]: [
    { level: 1, slot: SpellSlot.Main, spell: Spells.Hit },
    { level: 1, slot: SpellSlot.Secondary, spell: Spells.Dot },
  ],
  [Class.Sage]: [
    { level: 1, slot: SpellSlot.Main, spell: Spells.Heal },
    { level: 1, slot: SpellSlot.Secondary, spell: Spells.Hot },
  ],
  [Class.Mage]: [
    { level: 1, slot: SpellSlot.Main, spell: Spells.Dot },
    { level: 1, slot: SpellSlot.Secondary, spell: Spells.SplitFire },
  ],
  [Class.Hunter]: [
    { level: 1, slot: SpellSlot.Main, spell: Spells.Shot },
    { level: 1, slot: SpellSlot.Secondary, spell: Spells.SplitFire },
  ],
};
