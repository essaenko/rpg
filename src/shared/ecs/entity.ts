import { Schema, type, MapSchema } from '@colyseus/schema';
import { Component } from './component';

export class Entity extends Schema {
  @type('string') id: string;

  @type({ map: Component }) components = new MapSchema<Component>();

  get<T extends Component>(name: string): T | undefined {
    return this.components.get(name) as T | undefined;
  }

  has(name: string): boolean {
    return this.components.has(name);
  }

  addComponent(component: Component): void {
    this.components.set(component.name, component);
  }

  onDestroy(): void {}
}
