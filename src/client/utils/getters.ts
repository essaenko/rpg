import { Resource } from '@client/ecs/components/game/stats/resource';
import { Relation, ResourceType } from '@shared/types';
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
};

export const getHealthColor = (relation: Relation): number => {
  switch (relation) {
    case Relation.Neutral:
      return 0xe7a614;
    case Relation.Friendly:
      return 0x58b504;
    case Relation.Hostile:
      return 0x8a0303;
  }
};
