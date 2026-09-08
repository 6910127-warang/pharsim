import competencyMap from '../data/competencyMap.json';

function Bar({ label, value }) {
  return (
    <div className="stat-bar">
      <div className="stat-bar-header">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="stat-bar-track">
        <div className="stat-bar-fill" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function StatPanel({ state }) {
  return (
    <aside className="stat-panel">
      <div className="stat-panel-header">
        <h2>{state.playerName}</h2>
        <p>
          วันที่ {state.day} · เวร{state.shift === 'morning' ? 'เช้า' : 'บ่าย'}
        </p>
        <Bar label="พลังงาน" value={state.energy} />
      </div>

      <section>
        <h3>สมรรถนะ</h3>
        {Object.entries(state.stats).map(([key, value]) => (
          <Bar key={key} label={competencyMap[key]?.label ?? key} value={value} />
        ))}
      </section>

      <section>
        <h3>ความสัมพันธ์</h3>
        <Bar label="พี่เลี้ยง" value={state.relationships.preceptor} />
        <Bar label="ทีมพยาบาล" value={state.relationships.nurseTeam} />
        <Bar label="ผู้ป่วย" value={state.relationships.patients} />
      </section>
    </aside>
  );
}
