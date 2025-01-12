import { Scene } from 'phaser';
import { ECSContainer } from './index';
import { TransportEventTypes } from '@shared/types';
import { NetworkScene } from '@client/core/scene/network-scene';

export abstract class System {
  protected constructor(public name: string) {}

  abstract onUpdate(scene: Scene, container: ECSContainer): void;

  handleMessage(type: TransportEventTypes, message: any, container: ECSContainer, scene: NetworkScene) {}
}
