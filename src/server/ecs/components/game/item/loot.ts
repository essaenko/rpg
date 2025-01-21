import { ArraySchema, type } from '@colyseus/schema';
import { Component } from '@shared/ecs/component';
import { Item } from '@shared/schemas/game/item/item';

export class Loot extends Component {
  @type('string') id: string = null;
  @type([Item]) items: ArraySchema<Item> = new ArraySchema<Item>();

  constructor() {
    super('loot');
  }

  init(state: Record<string, any>): void {}
}
