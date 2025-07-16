import { Schema, type } from '@colyseus/schema';
import { ItemSave } from '@server/mongodb/types';

export class Item extends Schema {
  @type('string') id: string = '';
  @type('string') name: string;
  @type('string') description: string;
  @type('number') cost: number;
  public stackable: boolean = false;
  public maxStack: number = 1;
  public factory: string = 'item';

  init(state: ItemSave) {
    this.id = state.id;
    this.name = state.name;
    this.description = state.description;
    this.cost = state.cost;
    this.stackable = state.stackable ?? false;
    this.maxStack = state.maxStack ?? 1;
  }

  validateSave(save: unknown): save is ItemSave {
    return typeof save === 'object' && 'id' in save && 'name' in save && 'cost' in save;
  }
}

export class Stack extends Schema {
  @type(Item) item: Item;
  @type('number') amount: number = 1;

  constructor(item: Item, amount: number) {
    super();
    this.item = item;
    this.amount = amount;
  }

  init(item: Item, amount: number) {
    this.item = item;
    this.amount = amount;
  }

  add(amount: number): number {
    const left = Math.max(this.amount + amount - this.item.maxStack, 0);
    this.amount = Math.min(this.amount + amount, this.item.maxStack);

    return left;
  }

  remove(amount: number): number {
    if (this.amount - amount <= 0) {
      this.destroy();
      return Math.abs(this.amount - amount);
    } else {
      this.amount -= amount;
      return 0;
    }
  }

  destroy() {
    this.item = null;
    this.amount = null;
  }
}
