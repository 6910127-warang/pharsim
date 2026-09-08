import StatPanel from './StatPanel';
import EventDialog from './EventDialog';

export default function ShiftScreen({ state, currentEvent, onResolveChoice, onAdvance }) {
  return (
    <div className="shift-screen">
      <StatPanel state={state} />

      <main className="shift-main">
        {currentEvent ? (
          <EventDialog event={currentEvent} onResolved={onResolveChoice} />
        ) : (
          <div className="shift-idle">
            <p>เวรนี้ไม่มีสถานการณ์พิเศษเกิดขึ้น</p>
            <button onClick={onAdvance}>ไปเวรถัดไป</button>
          </div>
        )}
      </main>
    </div>
  );
}
