import { ArraySchema, type } from '@colyseus/schema';
import { Component, NetworkComponent } from '@shared/ecs/component';
import { Item, Stack } from '@shared/schemas/game/item/item';

export class Loot extends NetworkComponent {
  @type('string') id: string = null;
  @type([Stack]) items: ArraySchema<Stack> = new ArraySchema<Stack>();

  constructor() {
    super('loot');
  }

  init(state: Record<string, any>): void {}
}
