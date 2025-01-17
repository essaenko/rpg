import { Schema, type } from '@colyseus/schema';
import { ItemSave } from '@server/mongodb/types';
import { isItemFactoryName, map } from './map';

export class Item extends Schema {
  @type('string') id: string = '';
  @type('string') name: string;
  @type('string') description: string;
  @type('number') cost: number;
  public factory: string = 'item';

  init(state: ItemSave) {
    this.id = state.id;
    this.name = state.name;
    this.description = state.description;
    this.cost = state.cost;
  }
}
