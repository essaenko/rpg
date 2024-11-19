import { TransportEventTypes } from '../types';
import { Client } from '@colyseus/core';
import { Scene } from '../../server/core/scene/scene';
import { ECSContainer } from './index';

export abstract class System {
  protected constructor(public name: string) {}

  abstract handleMessage(client: Client, type: TransportEventTypes, message: any, container: ECSContainer): void;

  abstract onUpdate(delta: number, container: ECSContainer, scene: Scene): void;
}
