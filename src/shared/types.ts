export enum TransportEventTypes {
  Move,
  CastRequest,
}

export enum Directions {
  Forward,
  Backward,
  Left,
  Right,
}

export enum SpellBinding {
  Spell1,
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
  Mana,
  Rage,
  Energy,
}

export enum Class {
  Warrior = 'warrior',
}

export enum EquipSlot {
  Head = 'head',
  Chest = 'chest',
  Shoulder = 'shoulder',
  Hand = 'hand',
  Pants = 'pants',
  Boots = 'boots',
  MainHand = 'mainHand',
  OffHand = 'offHand',
  Ring = 'ring',
  Trinket = 'trinket',
}

export enum WeaponHand {
  MainHand,
  OffHand,
  DualHand,
}

export enum WeaponType {
  Sword,
  Dagger,
  Staff,
  Shield,
  Axe,
  Bow,
  Wand,
}
