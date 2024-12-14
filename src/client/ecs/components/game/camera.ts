import { Component } from '@client/core/ecs/component/component';

export class Camera extends Component {
  constructor(public following: boolean = false) {
    super('camera');
  }
}
