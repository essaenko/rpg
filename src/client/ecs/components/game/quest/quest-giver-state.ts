import { Component } from '@client/core/ecs/component/component';
import { QuestGiverStates } from '@client/utils/types';
import QuestGiverStateSprite from '@client/assets/sprites/UI/quest-giver-state.png';

export class QuestGiverState extends Component {
  constructor() {
    super('quest-giver-state');
  }

  public asset = {
    loading: false,
    loaded: false,
    key: 'quest-giver-state',
    url: QuestGiverStateSprite,
    config: {
      frameWidth: 20,
      frameHeight: 20,
    },
  };
  public state: QuestGiverStates;
}
