import { Component } from '@client/core/ecs/component/component';

export class Action extends Component {
  constructor() {
    super('action');
  }

  tag: string = null;
  action: () => void;
}
