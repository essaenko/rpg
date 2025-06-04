import { PatrolTree } from '@server/mechanics/behaviors/patrol';
import { AggroTree } from '@server/mechanics/behaviors/aggro';

export const map = {
  patrol: PatrolTree,
  aggro: AggroTree,
};
