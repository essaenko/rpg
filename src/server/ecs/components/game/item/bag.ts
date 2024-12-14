import { Component } from '@shared/ecs/component';
import { ArraySchema, type } from '@colyseus/schema';
import { Item } from '@shared/schemas/game/item/item';

export class Bag extends Component {
  constructor() {
    super('bag');
  }

  serializable = true;

  @type([Item]) items = new ArraySchema<Item>();
  @type('number') slots: number = 0;

  init(state: Record<string, any>): void {
    if (state.items) {
      for (let save of state.items) {
      }
    }
  }
}
