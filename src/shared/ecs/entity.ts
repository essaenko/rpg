import { Schema, type, ArraySchema } from '@colyseus/schema';
import { Component, ComponentType, NetworkComponent } from './component';
import { EntitySave } from '@server/mongodb/types';
import { isComponentName, map as ComponentMap } from '@server/ecs/components/map';
import { nanoid } from 'nanoid';
import { Client } from 'colyseus';

export class Entity {
  public _id: string;

  public components: ComponentType[] = [];

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

  add(...components: ComponentType[]): void {
    this.components.push(...components);
  }

  remove(name: string): void;
  remove(instance: ComponentType): void;
  remove(signature: string | ComponentType): void {
    let component;
    if (typeof signature === 'string') {
      component = this.get(signature);
    } else {
      component = signature;
    }

    if (component) {
      component.onDestroy();
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

        this.add(component);
      }
    });
  }

  onDestroy(): void {
    this.components.forEach((c) => {
      c.onDestroy();
    });
  }
}

export class EntitySchema extends Schema {
  @type('string') id: string;

  @type([NetworkComponent]) components = new ArraySchema<NetworkComponent>();
}

export class NetworkEntity extends Entity {
  constructor() {
    super();
  }
  public _client: Client;
  public _schema: EntitySchema = new EntitySchema();

  public components: ComponentType[] = [];

  public set id(value: string) {
    super.id = value;
    this._schema.id = value;
  }

  public get id() {
    return this._id;
  }

  add(...components: ComponentType[]): void {
    super.add(...components);

    for (const c of components) {
      if (c instanceof NetworkComponent) {
        this._schema.components.push(c);
      }
    }
  }

  remove(name: string): void;
  remove(instance: ComponentType): void;
  remove(signature: string | ComponentType): void {
    let component;
    if (typeof signature === 'string') {
      super.remove(signature);
      component = this.get(signature);
    } else {
      super.remove(signature);
      component = signature;
    }

    if (component && component instanceof NetworkComponent) {
      this._schema.components.splice(this._schema.components.indexOf(component), 1);
    }
  }
}
