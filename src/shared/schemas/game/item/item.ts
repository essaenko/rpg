import { Schema, type } from '@colyseus/schema';

export abstract class Item extends Schema {
  @type('string') name: string;
  @type('string') description: string;
  @type('number') cost: number;

  factory: string;
  abstract init(state: Record<string, any>): void;
}
