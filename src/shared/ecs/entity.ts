import { Schema, type, ArraySchema } from '@colyseus/schema';
import { Component, ComponentType, NetworkComponent } from './component';
import { EntitySave } from '@server/mongodb/types';
import { isComponentName, map as ComponentMap } from '@server/ecs/components/map';
import { nanoid } from 'nanoid';

export class Entity {
  public _id: string;

  public components = new Array();

  public get id() {
    return this._id;
  }

  public set id(value: string) {
    this._id = value;
  }

  get<T extends ComponentType>(name: string): T | undefined {
    return this.components.find(({ name: n }) => n === name) as T | undefined;
  }

  /**
   * Retrives all instanses of components with given name or undefined
   * @param name string
   * @returns Component[] | undefined
   */
  getAll<T extends ComponentType>(name: string): T[] | undefined {
    const r = this.components.filter(({ name: n }) => n === name);

    if (r.length) {
      return r as T[];
    }

    return undefined;
  }

  has(name: string): boolean {
    return this.components.some(({ name: n }) => n === name);
  }

  addComponent(component: ComponentType): void {
    this.components.push(component);
  }

  removeComponent(name: string): void;
  removeComponent(instance: ComponentType): void;
  removeComponent(signature: string | ComponentType): void {
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

export class EntitySchema extends Schema {
  @type('string') id: string;

  @type([NetworkComponent]) components = new ArraySchema<NetworkComponent>();
}

export class NetworkEntity extends Entity {
  constructor() {
    super();
  }
  public _schema: EntitySchema = new EntitySchema();

  public components: (Component | NetworkComponent)[] = new Array();

  public set id(value: string) {
    super.id = value;
    this._schema.id = value;
  }

  public get id() {
    return this._id;
  }

  addComponent(component: Component | NetworkComponent): void {
    super.addComponent(component);

    if (component instanceof NetworkComponent) {
      this._schema.components.push(component);
    }
  }

  removeComponent(name: string): void;
  removeComponent(instance: ComponentType): void;
  removeComponent(signature: string | ComponentType): void {
    let component;
    if (typeof signature === 'string') {
      super.removeComponent(signature);
      component = this.get(signature);
    } else {
      super.removeComponent(signature);
      component = signature;
    }

    if (component && component instanceof NetworkComponent) {
      this._schema.components.splice(this._schema.components.indexOf(component), 1);
    }
  }
}
