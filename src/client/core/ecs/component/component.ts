import EventBus, { EventCallback } from 'js-event-bus';

export abstract class Component {
  protected constructor(public name: string) {}

  private bus: EventBus = new EventBus();

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

  public destroy() {
    this.emit('component:destroy');
  }
}
