import { Schema, type, ArraySchema } from '@colyseus/schema';
import { Component } from './component';

export class Entity extends Schema {
  @type('string') id: string;

  @type([Component]) components = new ArraySchema<Component>();

  get<T extends Component>(name: string): T | undefined {
    return this.components.find(({ name: n }) => n === name) as T | undefined;
  }

  has(name: string): boolean {
    return this.components.some(({ name: n }) => n === name);
  }

  addComponent(component: Component): void {
    this.components.push(component);
  }

  removeComponent(name: string): void;
  removeComponent(instance: Component): void;
  removeComponent(signature: string | Component): void {
    let component;
    if (typeof signature === 'string') {
      component = this.get(signature);
    } else {
      component = signature;
    }

    if (component) {
      this.components.splice(this.components.indexOf(component), 1);
    }
  }

  onDestroy(): void {}
}
