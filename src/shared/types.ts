export enum TransportEventTypes {
  Move = 1,
  CastRequest,
  //Quest events
  QuestAccepted,
  QuestRejected,
  QuestCompleted,
  AcceptQuest,
  RejectQuest,
  CompleteQuest,
  Interaction,
  Loot,
  PickItem,

  GetObjects,
  ObjectsState,

  ChangeScene,

  Resurrect,
}

export type ObjectStateType = Pointer2D & {
  id: string;
  type: string;
  gid: number;
};

export type ObjectsStateType = ObjectStateType[];

export const isObjectsState = (data: unknown): data is ObjectsStateType => {
  return Array.isArray(data) && data.every((it) => 'x' in it && 'y' in it);
};

export enum InteractionTypes {
  Loot = 1,
  Gather,
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

export type Pointer2D = {
  x: number;
  y: number;
};

export type Body = {
  width: number;
  height: number;
};

export type Triangle = {
  a: Pointer2D;
  b: Pointer2D;
  c: Pointer2D;
};

export enum ResourceType {
  Mana = 1,
  Rage,
  Energy,
}

export enum Class {
  Warrior = 1,
  Sage,
  Mage,
  Hunter,
}

export enum GearSlot {
  Head = 1,
  Chest,
  Shoulder,
  Boots,
  MainHand,
  OffHand,
  Ring,
  Trinket,
  Food,
  Flask,
}

export enum GearType {
  Cloth,
  Leather,
  Chain,
  Plate,
}

export enum WeaponHand {
  MainHand = 1,
  OffHand,
  DualHand,
}

export enum WeaponType {
  HeavyMace = 1,
  Mace,
  HeavyShield,
  Shield,
  HeavyAxe,
  Axe,
  HeavySword,
  Sword,
  Dagger,
  LongBow,
  Bow,
  CrossBow,
  Staff,
  Wand,
}

export enum Fraction {
  Ancient = 1,
  BrotherHood,
  Neutral,
  Hostile,
}

export enum Relation {
  Friendly = 1,
  Hostile,
  Neutral,
}

export const Relations: Record<Fraction, Record<Fraction, Relation>> = {
  [Fraction.BrotherHood]: {
    [Fraction.Ancient]: Relation.Hostile,
    [Fraction.BrotherHood]: Relation.Friendly,
    [Fraction.Neutral]: Relation.Neutral,
    [Fraction.Hostile]: Relation.Hostile,
  },
  [Fraction.Ancient]: {
    [Fraction.Ancient]: Relation.Friendly,
    [Fraction.BrotherHood]: Relation.Hostile,
    [Fraction.Neutral]: Relation.Neutral,
    [Fraction.Hostile]: Relation.Hostile,
  },
  [Fraction.Neutral]: {
    [Fraction.Ancient]: Relation.Neutral,
    [Fraction.BrotherHood]: Relation.Neutral,
    [Fraction.Neutral]: Relation.Neutral,
    [Fraction.Hostile]: Relation.Hostile,
  },
  [Fraction.Hostile]: {
    [Fraction.Ancient]: Relation.Hostile,
    [Fraction.BrotherHood]: Relation.Hostile,
    [Fraction.Neutral]: Relation.Hostile,
    [Fraction.Hostile]: Relation.Hostile,
  },
};

export enum SpellSlot {
  Main = '0',
  Secondary = '1',
  Buff = '2',
  Ultimate = '3',
  Save = '4',
  Dodge = '5',
  Food = '6',
  Flask = '7',
  Gather = '8',
  Loot = '9',
}
