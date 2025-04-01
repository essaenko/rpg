import { ECSContainer } from '@client/core/ecs';
import { System } from '@client/core/ecs/system';
import { NetworkScene } from '@client/core/scene/network-scene';
import { TransportEventTypes } from '@shared/types';

export class SceneSystem extends System {
  onUpdate(scene: Phaser.Scene, container: ECSContainer, delta: number): void {
    // throw new Error('Method not implemented.');
  }

  handleMessage(type: TransportEventTypes, message: any, container: ECSContainer, scene: NetworkScene): void {
    if (type === TransportEventTypes.ChangeScene) {
      container.destroy();
      scene.scene.stop();
      scene.scene.launch(message);
    }
  }
  constructor() {
    super('scene');
  }
}
