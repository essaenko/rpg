import { ECSContainer } from '@client/core/ecs';
import { System } from '@client/core/ecs/system';
import { NetworkScene } from '@client/core/scene/network-scene';
import { TransportEventTypes } from '@shared/types';
import { Networking } from '@client/services/networking';

export class SceneSystem extends System {
  onUpdate(scene: Phaser.Scene, container: ECSContainer, delta: number): void {
    // throw new Error('Method not implemented.');
  }

  async handleMessage(type: TransportEventTypes, message: any, container: ECSContainer, scene: NetworkScene): Promise<void> {
    if (type === TransportEventTypes.ChangeScene) {
      const name = scene.scene.key;
      container.destroy();
      scene.room.removeAllListeners();
      await Networking.instance.leave();
      scene.scene.stop();
      scene.scene.manager.remove(name).getScene('boot')?.scene.restart();
    }
  }
  constructor() {
    super('scene');
  }
}
