import { Component, NetworkComponent } from '@shared/ecs/component';
import { ArraySchema, type, view } from '@colyseus/schema';
import { Item, Stack } from '@shared/schemas/game/item/item';
import { MDBClient } from '@server/mongodb';
import { isItem } from '@server/mongodb/types';
import { ItemFactory } from '@shared/schemas/game/item/map';

export class Inventory extends NetworkComponent {
  constructor() {
    super('inventory');
  }

  serializable = true;

  @type([Stack]) items = new ArraySchema<Stack>();
  @type('number') slots: number = 25;
  @type('number') gold: number = 0;

  async init(state: Record<string, any>): Promise<void> {
    this.slots = state.slots ?? 25;
    if (state.items) {
      for (let { item, amount } of state.items) {
        const save = await MDBClient.instance().readItem(item);

        if (save && isItem(save)) {
          const item = ItemFactory.instantiate(save);

          this.items.push(new Stack(item, amount));
        }
      }
    }
  }

  addItem(item: Item, amount: number = 1): void {
    if (item.stackable) {
      const stack = this.items.find((stack) => stack.item.id === item.id && stack.amount < item.maxStack);

      if (stack) {
        const left = stack.add(amount);

        if (left) {
          this.addItem(item, left);
        }
      } else if (this.slots > this.items.length) {
        this.items.push(new Stack(item, amount));
      }
    } else if (this.slots > this.items.length) {
      this.items.push(new Stack(item, 1));

      if (amount > 1) {
        this.addItem(item, amount - 1);
      }
    }
  }

  removeItem(item: string, amount: number = 1): void {
    const stack = this.items.find((stack) => stack.item.id === item);

    if (stack) {
      const left = stack.remove(amount);

      if (left) {
        this.items.splice(this.items.indexOf(stack), 1);
        this.removeItem(item, left);
      }
    }
  }

  addGold(amount: number): void {
    this.gold += amount;
  }

  reduceGold(amount: number): void {
    this.gold = Math.max(this.gold - amount, 0);
  }

  serialize(): Record<string, any> {
    return {
      name: this.name,
      items: this.items.map(({ item, amount }) => ({ item: item.id, amount })),
      slots: this.slots,
    };
  }
}
