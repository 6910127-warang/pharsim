import competencyMap from '../data/competencyMap.json';

export default function ReportCard({ state, onRestart }) {
  return (
    <div className="report-card">
      <h1>รายงานผลการฝึกงาน</h1>
      <p>{state.playerName} · ฝึกงานครบ {state.day - 1} วัน</p>

      <section>
        <h2>สรุปสมรรถนะ</h2>
        <ul className="report-competencies">
          {Object.entries(state.stats).map(([key, value]) => (
            <li key={key}>
              <strong>{competencyMap[key]?.label ?? key}:</strong> {value}/100
              <p>{competencyMap[key]?.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>บันทึกการตัดสินใจ ({state.log.length} เหตุการณ์)</h2>
        <ol className="report-log">
          {state.log.map((entry, index) => (
            <li key={`${entry.eventId}-${index}`}>
              <strong>วันที่ {entry.day} ({entry.shift === 'morning' ? 'เช้า' : 'บ่าย'}) — {entry.eventTitle}</strong>
              <p>เลือก: {entry.choiceText}</p>
            </li>
          ))}
        </ol>
      </section>

      <button onClick={onRestart}>เริ่มเกมใหม่</button>
    </div>
  );
}
