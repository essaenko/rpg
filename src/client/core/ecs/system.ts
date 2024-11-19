import { Scene } from 'phaser';
import { ECSContainer } from './index';

export abstract class System {
  protected constructor(public name: string) {}

  abstract onUpdate(scene: Scene, container: ECSContainer): void;
}
