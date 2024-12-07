import { Fraction, Relation, Relations } from '@shared/types';

export const getRelation = (f1: Fraction, f2: Fraction): Relation => {
  return Relations[f1]?.[f2] ?? Relation.Neutral;
};
