function matchesTrigger(event, state) {
  const trigger = event.trigger || {};

  if (trigger.minDay != null && state.day < trigger.minDay) return false;
  if (trigger.maxDay != null && state.day > trigger.maxDay) return false;
  if (trigger.requiredFlags?.some((flag) => !state.flags[flag])) return false;
  if (trigger.excludedFlags?.some((flag) => state.flags[flag])) return false;

  return true;
}

// Picks one eligible event, weighted by trigger.probability (default 1).
export function selectEvent(scenarios, state) {
  const candidates = scenarios.filter((event) => matchesTrigger(event, state));
  if (candidates.length === 0) return null;

  const weighted = candidates.map((event) => ({
    event,
    weight: event.trigger?.probability ?? 1,
  }));
  const totalWeight = weighted.reduce((sum, w) => sum + w.weight, 0);

  let roll = Math.random() * totalWeight;
  for (const { event, weight } of weighted) {
    roll -= weight;
    if (roll <= 0) return event;
  }

  return weighted[weighted.length - 1].event;
}
