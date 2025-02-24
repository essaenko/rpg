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
}

export type ObjectStateType = Position & {
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

export type Position = {
  x: number;
  y: number;
};

export type Body = {
  width: number;
  height: number;
};

export type Triangle = {
  a: Position;
  b: Position;
  c: Position;
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
  Ancient = 1,
  BrotherHood,
  Neutral,
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
  },
  [Fraction.Ancient]: {
    [Fraction.Ancient]: Relation.Friendly,
    [Fraction.BrotherHood]: Relation.Hostile,
    [Fraction.Neutral]: Relation.Neutral,
  },
  [Fraction.Neutral]: {
    [Fraction.Ancient]: Relation.Neutral,
    [Fraction.BrotherHood]: Relation.Neutral,
    [Fraction.Neutral]: Relation.Neutral,
  },
};
