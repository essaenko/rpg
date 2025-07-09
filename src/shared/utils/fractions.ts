import { Fraction, Relation, Relations } from '@shared/types';
import { Fraction as FractionComp } from '@server/ecs/components/game/mechanics/fraction';
import { Entity } from '@client/core/ecs/entity/entity';

export const getRelation = (f1: Fraction, f2: Fraction): Relation => {
  return Relations[f1]?.[f2] ?? Relation.Neutral;
};
