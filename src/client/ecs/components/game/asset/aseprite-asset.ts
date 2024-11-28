import { Component } from '@client/core/ecs/component/component';

export class AsepriteAssetComponent extends Component {
  public loaded: boolean = false;
  public loading: boolean = false;

  constructor(
    public key: string,
    public texture: string,
    public atlas: string,
  ) {
    super('aseprite-asset');
  }
}
