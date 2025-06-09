import { Resource } from '@client/ecs/components/game/stats/resource';
import { ResourceType } from '@shared/types';
import { COLORS } from '@client/utils/const';

export const getResourceColor = (resource: Resource): number => {
  switch (resource.type) {
    case ResourceType.Rage:
      return COLORS.Rage;
    case ResourceType.Energy:
      return COLORS.Energy;
    case ResourceType.Mana:
      return COLORS.Mana;
  }
}