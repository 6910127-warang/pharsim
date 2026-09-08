export const SHIFTS = ['morning', 'afternoon'];
export const TOTAL_DAYS = 10;
export const ENERGY_COST_PER_SHIFT = 10;

export function advanceShift(state) {
  const currentIndex = SHIFTS.indexOf(state.shift);
  const isLastShiftOfDay = currentIndex === SHIFTS.length - 1;

  if (isLastShiftOfDay) {
    return {
      ...state,
      day: state.day + 1,
      shift: SHIFTS[0],
      energy: 100,
    };
  }

  return {
    ...state,
    shift: SHIFTS[currentIndex + 1],
    energy: Math.max(0, state.energy - ENERGY_COST_PER_SHIFT),
  };
}

export function isGameOver(state) {
  return state.day > TOTAL_DAYS;
}
