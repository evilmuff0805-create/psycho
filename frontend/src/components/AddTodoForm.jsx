import { useState } from 'react';

const PRIORITY_LABELS = { high: '높음', medium: '중간', low: '낮음' };

export default function AddTodoForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('');
  const [priority, setPriority] = useState('medium');
  const [open, setOpen] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd(trimmed, time || null, priority);
    setTitle('');
    setTime('');
    setPriority('medium');
    setOpen(false);
  }

  if (!open) {
    return (
      <button className="add-todo-btn" onClick={() => setOpen(true)} aria-label="할일 추가">
        + 추가
      </button>
    );
  }

  return (
    <form className="add-todo-form" onSubmit={handleSubmit}>
      <input
        autoFocus
        type="text"
        placeholder="할일 제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        maxLength={100}
      />
      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />
      <select
        className="priority-select"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
        aria-label="우선순위"
      >
        {Object.entries(PRIORITY_LABELS).map(([val, label]) => (
          <option key={val} value={val}>{label}</option>
        ))}
      </select>
      <div className="form-actions">
        <button type="submit">추가</button>
        <button type="button" onClick={() => setOpen(false)}>취소</button>
      </div>
    </form>
  );
}
