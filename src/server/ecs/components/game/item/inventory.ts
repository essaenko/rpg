import { Component } from '@shared/ecs/component';
import { ArraySchema, type } from '@colyseus/schema';
import { Item } from '@shared/schemas/game/item/item';
import { MDBClient } from '@server/mongodb';
import { isItem } from '@server/mongodb/types';
import { ItemFactory } from '@shared/schemas/game/item/map';

export class Inventory extends Component {
  constructor() {
    super('inventory');
  }

  serializable = true;

  @type([Item]) items = new ArraySchema<Item>();
  @type('number') slots: number = 25;

  async init(state: Record<string, any>): Promise<void> {
    this.slots = state.slots ?? 25;
    if (state.items) {
      for (let id of state.items) {
        const save = await MDBClient.instance().readItem(id);

        if (save && isItem(save)) {
          const item = ItemFactory.instantiate(save);

          this.items.push(item);
        }
      }
    }
  }

  serialize(): Record<string, any> {
    return {
      name: this.name,
      items: this.items.map(({ id }) => id),
      slots: this.slots,
    };
  }
}
