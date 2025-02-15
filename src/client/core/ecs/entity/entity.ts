import { Component } from '../component/component';
import EventBus, { EventCallback } from 'js-event-bus';

export class Entity {
  public id: string;
  private components: Component[] = [];
  private bus: EventBus = new EventBus();

  constructor(id: string) {
    this.id = id;
  }

  public on(name: string, callback: EventCallback) {
    this.bus.on(name, callback);
  }

  public detach(name: string, callback: EventCallback) {
    this.bus.detach(name, callback);
  }

  public emit(name: string) {
    this.bus.emit(name);
  }

  public detachAll() {
    this.bus.detachAll();
  }

  public add(...component: Component[]): void {
    this.components.push(...component);
    this.emit('entity:components:add');
  }

  public remove(signature: Component): void;
  public remove(signature: string): void;
  public remove(signature: string | Component): void {
    let component;
    if (typeof signature === 'string') {
      component = this.components.find((component) => component.name === signature);
    } else {
      component = signature;
    }

    if (component) {
      component.destroy();
      this.components.splice(this.components.indexOf(component), 1);
    }

    this.emit('entity:components:remove');
  }

  get<T extends Component>(name: string): T | undefined {
    return this.components.find((c) => c.name === name) as T | undefined;
  }

  getAll<T extends Component>(name: string): T[] {
    return this.components.filter((c) => c.name === name) as T[];
  }

  has(name: string): boolean {
    return this.components.some(({ name: n }) => n === name);
  }

  destroy() {
    this.emit('entity:destroy');
    this.components.forEach((component) => {
      component.destroy();
    });
    this.detachAll();
  }
}
