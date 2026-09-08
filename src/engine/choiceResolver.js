function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function applyDeltas(current, deltas = {}) {
  const next = { ...current };
  for (const [key, delta] of Object.entries(deltas)) {
    next[key] = clamp((next[key] ?? 0) + delta);
  }
  return next;
}

// Applies a chosen choice's effects to player state and appends a log entry.
export function resolveChoice(state, event, choice) {
  const stats = applyDeltas(state.stats, choice.effects?.stats);
  const relationships = applyDeltas(state.relationships, choice.effects?.relationships);

  const flags = { ...state.flags };
  for (const flag of choice.setFlags || []) {
    flags[flag] = true;
  }

  const logEntry = {
    day: state.day,
    shift: state.shift,
    eventId: event.id,
    eventTitle: event.title,
    choiceId: choice.id,
    choiceText: choice.text,
    feedback: choice.feedback,
  };

  return {
    ...state,
    stats,
    relationships,
    flags,
    log: [...state.log, logEntry],
  };
}
