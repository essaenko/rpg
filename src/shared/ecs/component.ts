import { Schema, type } from '@colyseus/schema';

export abstract class Component extends Schema {
  constructor(name: string) {
    super();

    this.name = name;
  }

  public serializable: boolean = false;

  @type('string') name: string;

  abstract init(state: Record<string, any>): void;

  public serialize(): Record<string, any> {
    return { ...this };
  }
}
