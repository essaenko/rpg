import { Schema, type } from '@colyseus/schema';

export interface ComponentType {
  name: string;

  init(state: Record<string, any>): void;
  serialize(): Record<string, any>;

  onDestroy(): void;
}

export abstract class Component implements ComponentType {
  constructor(name: string) {
    this.name = name;
  }

  public serializable: boolean = false;
  public name: string;

  abstract init(state: Record<string, any>): void;

  public serialize(): Record<string, any> {
    return { ...this };
  }

  public onDestroy(): void {}
}

export abstract class NetworkComponent extends Schema implements ComponentType {
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

  public onDestroy(): void {}
}
