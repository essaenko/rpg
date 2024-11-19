import { Component } from '../component/component';

export abstract class Entity {
  public id: string;
  private components: Map<string, Component> = new Map();

  protected constructor(id: string) {
    this.id = id;
  }

  public addComponent(component: Component): void {
    this.components.set(component.name, component);
  }

  public removeComponent(name: string): void {
    this.components.delete(name);
  }

  get<T extends Component>(name: string): T | undefined {
    return this.components.get(name) as T | undefined;
  }

  destroy() {
    this.components.forEach((component) => {
      component.onRemove();
    });
  }
}
