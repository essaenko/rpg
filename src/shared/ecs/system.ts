import { TransportEventTypes } from '../types';
import { Client } from '@colyseus/core';
import { Scene } from '@server/core/scene/scene';
import { ECSContainer } from './index';
import Logger from 'js-logger';

const SystemLogger = Logger.get('SystemLogger');

export abstract class System {
  protected constructor(public name: string) {}

  private tick = 0;

  abstract handleMessage(client: Client, type: TransportEventTypes, message: any, container: ECSContainer): void;

  abstract onUpdate(delta: number, container: ECSContainer, scene: Scene): void;

  public update(delta: number, container: ECSContainer, scene: Scene): void {
    this.onBeforeUpdate(delta, container, scene);
    this.onUpdate(delta, container, scene);
    this.onAfterUpdate(delta, container, scene);
  }

  private onBeforeUpdate(delta: number, container: ECSContainer, scene: Scene): void {
    SystemLogger.debug(`[${this.name}_System]: Update scheduled`);
    this.tick = performance.now();
  }
  private onAfterUpdate(delta: number, container: ECSContainer, scene: Scene): void {
    SystemLogger.debug(`[${this.name}_System]: Update finished after: ${performance.now() - this.tick}ms`);
  }
}
