import { Animation } from '@shared/types';

export const getAnimationConfig = (animation: Animation) => {
  switch (animation) {
    case Animation.Idle:
      return { repeat: -1, repeatDelay: 1000, yoyo: true };
    case Animation.MovingBackward:
    case Animation.MovingForward:
    case Animation.MovingLeft:
    case Animation.MovingRight:
      return { repeat: -1 };

    default:
      return {};
  }
};

export const getAnimationKey = (animation: Animation) => {
  switch (animation) {
    case Animation.Idle:
      return 'idle_backward';
    case Animation.MovingLeft:
      return 'walk_left';
    case Animation.MovingRight:
      return 'walk_right';
    case Animation.MovingForward:
      return 'walk_forward';
    case Animation.MovingBackward:
      return 'walk_backward';
    case Animation.Cast:
      return 'cast';
  }
};
