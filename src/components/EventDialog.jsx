import { useState } from 'react';

const CATEGORY_LABELS = {
  onboarding: 'ปฐมนิเทศ',
  regulation: 'ระเบียบ/ข้อตกลง',
  incident: 'อุบัติการณ์',
  ethics: 'จริยธรรม',
};

export default function EventDialog({ event, onResolved }) {
  const [selectedChoice, setSelectedChoice] = useState(null);

  function handleChoose(choice) {
    setSelectedChoice(choice);
  }

  function handleContinue() {
    onResolved(selectedChoice);
    setSelectedChoice(null);
  }

  return (
    <div className="event-dialog">
      <span className="event-category">{CATEGORY_LABELS[event.category] ?? event.category}</span>
      <h2>{event.title}</h2>
      <p className="event-context">{event.context}</p>

      {!selectedChoice ? (
        <div className="event-choices">
          {event.choices.map((choice) => (
            <button key={choice.id} onClick={() => handleChoose(choice)}>
              {choice.text}
            </button>
          ))}
        </div>
      ) : (
        <div className="event-feedback">
          <p>{selectedChoice.feedback}</p>
          {event.sourceRef && <p className="event-source">อ้างอิง: {event.sourceRef}</p>}
          <button onClick={handleContinue}>ไปต่อ</button>
        </div>
      )}
    </div>
  );
}
