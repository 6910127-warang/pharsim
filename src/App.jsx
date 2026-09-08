import { useMemo, useState } from 'react';
import './App.css';

import { createInitialState } from './state/gameState';
import { advanceShift, isGameOver } from './engine/timeEngine';
import { selectEvent } from './engine/eventSelector';
import { resolveChoice } from './engine/choiceResolver';
import { saveGame, loadGame, clearSave } from './engine/saveSystem';

import onboardingScenarios from './data/scenarios/onboarding.json';
import regulationScenarios from './data/scenarios/regulations.json';
import incidentScenarios from './data/scenarios/incidents.json';
import ethicsScenarios from './data/scenarios/ethics.json';

import ShiftScreen from './components/ShiftScreen';
import ReportCard from './components/ReportCard';

const ALL_SCENARIOS = [
  ...onboardingScenarios,
  ...regulationScenarios,
  ...incidentScenarios,
  ...ethicsScenarios,
];

function pickEventForState(state) {
  return selectEvent(ALL_SCENARIOS, state);
}

export default function App() {
  const savedGame = useMemo(() => loadGame(), []);

  const [gameState, setGameState] = useState(savedGame);
  const [currentEvent, setCurrentEvent] = useState(() =>
    savedGame ? pickEventForState(savedGame) : null
  );
  const [playerNameInput, setPlayerNameInput] = useState('');

  function handleStart() {
    const name = playerNameInput.trim() || 'นักศึกษาฝึกงาน';
    const initialState = createInitialState(name);
    setGameState(initialState);
    setCurrentEvent(pickEventForState(initialState));
    saveGame(initialState);
  }

  function handleResolveChoice(choice) {
    const updatedState = resolveChoice(gameState, currentEvent, choice);
    setGameState(updatedState);
    saveGame(updatedState);
    setCurrentEvent(null);
  }

  function handleAdvance() {
    const nextState = advanceShift(gameState);
    setGameState(nextState);
    saveGame(nextState);
    setCurrentEvent(isGameOver(nextState) ? null : pickEventForState(nextState));
  }

  function handleRestart() {
    clearSave();
    setGameState(null);
    setCurrentEvent(null);
    setPlayerNameInput('');
  }

  if (!gameState) {
    return (
      <div className="start-screen">
        <h1>นักศึกษาฝึกงานเภสัชกรรม</h1>
        <p>รพ.เชียงรายประชานุเคราะห์</p>
        <input
          type="text"
          placeholder="ชื่อผู้เล่น"
          value={playerNameInput}
          onChange={(e) => setPlayerNameInput(e.target.value)}
        />
        <button onClick={handleStart}>เริ่มฝึกงาน</button>
      </div>
    );
  }

  if (isGameOver(gameState)) {
    return <ReportCard state={gameState} onRestart={handleRestart} />;
  }

  return (
    <ShiftScreen
      state={gameState}
      currentEvent={currentEvent}
      onResolveChoice={handleResolveChoice}
      onAdvance={handleAdvance}
    />
  );
}
