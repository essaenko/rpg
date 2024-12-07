export enum TransportEventTypes {
  Move = 1,
  CastRequest,
}

export enum Directions {
  Forward = 1,
  Backward,
  Left,
  Right,
}

export enum Animation {
  Idle = 1,
  MovingForward,
  MovingBackward,
  MovingLeft,
  MovingRight,
  Hit,
  Cast,
  Rest,
  Dying,
}

export enum SpellBinding {
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

export type Position = {
  x: number;
  y: number;
};

export type Body = {
  width: number;
  height: number;
};

export enum ResourceType {
  Mana = 1,
  Rage,
  Energy,
}

export enum Class {
  Warrior = 1,
}

export enum EquipSlot {
  Head = 1,
  Chest,
  Shoulder,
  Hand,
  Pants,
  Boots,
  MainHand,
  OffHand,
  Ring,
  Trinket,
}

export enum WeaponHand {
  MainHand = 1,
  OffHand,
  DualHand,
}

export enum WeaponType {
  Sword = 1,
  Dagger,
  Staff,
  Shield,
  Axe,
  Bow,
  Wand,
}

export enum Fraction {
  Khazmodar = 1,
  Varta,
  Neutral,
}

export enum Relation {
  Friendly = 1,
  Hostile,
  Neutral,
}

export const Relations: Record<Fraction, Record<Fraction, Relation>> = {
  [Fraction.Varta]: {
    [Fraction.Khazmodar]: Relation.Hostile,
    [Fraction.Varta]: Relation.Friendly,
    [Fraction.Neutral]: Relation.Neutral,
  },
  [Fraction.Khazmodar]: {
    [Fraction.Khazmodar]: Relation.Friendly,
    [Fraction.Varta]: Relation.Hostile,
    [Fraction.Neutral]: Relation.Neutral,
  },
  [Fraction.Neutral]: {
    [Fraction.Khazmodar]: Relation.Neutral,
    [Fraction.Varta]: Relation.Neutral,
    [Fraction.Neutral]: Relation.Neutral,
  },
};
