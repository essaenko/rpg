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

    if (component) {
      component.destroy();
      this.components.splice(this.components.indexOf(component), 1);
    }
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
    this.components.forEach((component) => {
      component.destroy();
    });
  }
}
