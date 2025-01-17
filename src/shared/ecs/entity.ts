import { Schema, type, ArraySchema } from '@colyseus/schema';
import { Component } from './component';
import { EntitySave } from '@server/mongodb/types';
import { isComponentName, map as ComponentMap } from '@server/ecs/components/map';
import { nanoid } from 'nanoid';

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

  init(save: EntitySave, id?: string) {
    this.id = id ?? nanoid(9);

    save.components.forEach((cState) => {
      if (isComponentName(cState.name)) {
        const Factory = ComponentMap[cState.name];
        const component = new Factory();
        component.init(cState);

        this.addComponent(component);
      }
    });
  }

  onDestroy(): void {}
}
