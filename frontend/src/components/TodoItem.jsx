import { useState } from 'react';

const PRIORITY_LABELS = { high: '높음', medium: '중간', low: '낮음' };
const TEAM_LABELS = { writer: '작가팀', combined: '합본편집팀', master: '마스터팀' };

export default function TodoItem({ todo, onToggle, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editTime, setEditTime] = useState(todo.time || '');
  const [editPriority, setEditPriority] = useState(todo.priority || 'medium');
  const [editTeam, setEditTeam] = useState(todo.team || 'combined');

  const priority = todo.priority || 'medium';

  function handleEditSubmit(e) {
    e.preventDefault();
    const trimmed = editTitle.trim();
    if (!trimmed) return;
    onEdit(todo.id, { title: trimmed, time: editTime || null, priority: editPriority, team: editTeam });
    setEditing(false);
  }

  function handleEditCancel() {
    setEditTitle(todo.title);
    setEditTime(todo.time || '');
    setEditPriority(todo.priority || 'medium');
    setEditTeam(todo.team || 'combined');
    setEditing(false);
  }

  if (editing) {
    return (
      <li className="todo-item editing">
        <form className="edit-todo-form" onSubmit={handleEditSubmit}>
          <input
            autoFocus
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            maxLength={100}
          />
          <input
            type="time"
            value={editTime}
            onChange={(e) => setEditTime(e.target.value)}
          />
          <select
            className="priority-select"
            value={editPriority}
            onChange={(e) => setEditPriority(e.target.value)}
            aria-label="우선순위"
          >
            {Object.entries(PRIORITY_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
          <select
            className="priority-select"
            value={editTeam}
            onChange={(e) => setEditTeam(e.target.value)}
            aria-label="팀"
          >
            {Object.entries(TEAM_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
          <div className="form-actions">
            <button type="submit">저장</button>
            <button type="button" onClick={handleEditCancel}>취소</button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className={`todo-item${todo.completed ? ' completed' : ''}`}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id, !todo.completed)}
        aria-label={`${todo.completed ? '완료 취소' : '완료'}: ${todo.title}`}
      />
      <div className="todo-body">
        <span className={`todo-title${priority === 'high' ? ` highlight-high-${todo.team || 'combined'}` : ''}`}>
          {todo.title}
        </span>
        <div className="todo-meta">
          {todo.time && <span className="todo-time">{todo.time}</span>}
          <span className={`priority-badge ${priority}`}>{PRIORITY_LABELS[priority]}</span>
          <button
            className="edit-btn"
            onClick={() => setEditing(true)}
            aria-label="수정"
          >
            ✎
          </button>
          <button
            className="delete-btn"
            onClick={() => onDelete(todo.id)}
            aria-label="삭제"
          >
            ×
          </button>
        </div>
      </div>
    </li>
  );
}
