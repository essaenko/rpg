import { Component } from '../component/component';

export abstract class Entity {
  public id: string;
  private components: Component[] = [];

  protected constructor(id: string) {
    this.id = id;
  }

  public addComponent(component: Component): void {
    this.components.push(component);
  }

  public removeComponent(signature: Component): void;
  public removeComponent(signature: string): void;
  public removeComponent(signature: string | Component): void {
    let component;
    if (typeof signature === 'string') {
      component = this.components.find((component) => component.name === signature);
    } else {
      component = signature;
    }

    component?.onRemove();
    this.components.splice(this.components.indexOf(component), 1);
  }

  get<T extends Component>(name: string): T | undefined {
    return this.components.find((c) => c.name === name) as T | undefined;
  }

  has(name: string): boolean {
    return this.components.some(({ name: n }) => n === name);
  }

  destroy() {
    this.components.forEach((component) => {
      component.onRemove();
    });
  }
}
