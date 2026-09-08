export function createInitialState(playerName) {
  return {
    playerName,
    day: 1,
    shift: 'morning',
    energy: 100,
    stats: {
      academicKnowledge: 50,
      attentiveness: 50,
      communication: 50,
      professionalism: 50,
      confidence: 50,
    },
    relationships: {
      preceptor: 50,
      nurseTeam: 50,
      patients: 50,
    },
    flags: {},
    log: [],
  };
}
