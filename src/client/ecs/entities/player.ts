import DummySprite from '@client/assets/sprites/dummy/dummy-sprite.png';
import DummyAtlas from '@client/assets/sprites/dummy/dummy-sprite.json?url';
import { SpriteComponent } from '@client/ecs/components/game/sprite';
import { AsepriteAssetComponent } from '@client/ecs/components/game/aseprite-asset';
import { CameraComponent } from '@client/ecs/components/game/camera';
import { AnimationComponent } from '@client/ecs/components/game/animation';

import { Character } from './character';

export class Player extends Character {
  constructor(id: string) {
    super(id);
    this.addComponent(new AsepriteAssetComponent('dummy-texture', DummySprite, DummyAtlas));
    this.addComponent(new SpriteComponent());
    this.addComponent(new AnimationComponent());
    this.addComponent(new CameraComponent());
  }
}
