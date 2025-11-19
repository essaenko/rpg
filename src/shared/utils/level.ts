export const LVL_CAPS = [
  120, 144, 172, 207, 248, 298, 358, 429, 515, 696, 940, 1269, 1713, 2313, 3123, 4216, 5692, 7684, 10374, 15561, 23342,
  35014, 52521, 78781, 118172, 177258, 265888, 398832, 598248,
];

const MIN_EXP_REWARD = 10;
const LVL_CAPS_DIVIDER = 12;

export const BASE_KILL_EXP = LVL_CAPS.map((cap) => Math.max(MIN_EXP_REWARD, Math.round(cap / LVL_CAPS_DIVIDER)));

export const getBaseKillExp = (victimLevel: number, override?: number): number => {
  if (typeof override === 'number' && override >= 0) {
    return override;
  }

  if (!victimLevel || victimLevel <= 0) {
    return BASE_KILL_EXP[0];
  }

  const index = Math.min(BASE_KILL_EXP.length - 1, Math.max(1, victimLevel) - 1);

  return BASE_KILL_EXP[index];
};

export const getLevelDiffMultiplier = (attackerLevel: number, victimLevel: number): number => {
  if (!attackerLevel || attackerLevel <= 0) {
    attackerLevel = 1;
  }

  if (!victimLevel || victimLevel <= 0) {
    victimLevel = 1;
  }

  const diff = victimLevel - attackerLevel;
  const diffAbs = Math.abs(diff);

  if (diffAbs <= 3) {
    const modifier = 1 + diff * 0.1;
    return Math.max(0.1, modifier);
  }

  const penaltySteps = diffAbs - 3;
  return Math.max(0.1, 1 - penaltySteps * 0.2);
};

export const getAdjustedKillExp = (baseExp: number, attackerLevel: number, victimLevel: number): number => {
  const diffMultiplier = getLevelDiffMultiplier(attackerLevel, victimLevel);

  return Math.max(0, Math.round(baseExp * diffMultiplier));
};
