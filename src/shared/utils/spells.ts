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

export const CLASS_SPELLBOOK: Record<Class, ClassSpellBook> = {
  [Class.Warrior]: {
    [SpellSlot.Main]: Spells.Hit,
    [SpellSlot.Secondary]: Spells.Dot,
  },
  [Class.Sage]: {
    [SpellSlot.Main]: Spells.Heal,
    [SpellSlot.Secondary]: Spells.Hot,
  },
  [Class.Mage]: {
    [SpellSlot.Main]: Spells.Dot,
    [SpellSlot.Secondary]: Spells.SplitFire,
  },
  [Class.Hunter]: {
    [SpellSlot.Main]: Spells.Shot,
    [SpellSlot.Secondary]: Spells.SplitFire,
  },
};
