import { useDroppable } from '@dnd-kit/core';
import DayHeader from './DayHeader';
import TodoItem from './TodoItem';
import AddTodoForm from './AddTodoForm';

const TEAMS = [
  { key: 'writer', label: '작가팀' },
  { key: 'combined', label: '합본편집팀' },
  { key: 'master', label: '마스터팀' },
];

function toIsoDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export default function DayColumn({ date, todos, onAdd, onToggle, onDelete, onEdit }) {
  const today = new Date();
  const isToday =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  const dateStr = toIsoDate(date);
  const { setNodeRef, isOver } = useDroppable({ id: dateStr });

  return (
    <div
      ref={setNodeRef}
      className={`day-column${isToday ? ' today' : ''}${isOver ? ' drop-over' : ''}`}
    >
      <DayHeader date={date} />
      {TEAMS.map((team, idx) => (
        <div key={team.key} className="team-section">
          {idx > 0 && <div className="team-divider" />}
          <div className="team-label">{team.label}</div>
          <ul className="todo-list">
            {todos
              .filter((t) => (t.team || 'combined') === team.key)
              .map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={onToggle}
                  onDelete={onDelete}
                  onEdit={onEdit}
                />
              ))}
          </ul>
          <AddTodoForm onAdd={(title, time, priority) => onAdd(title, time, priority, team.key)} />
        </div>
      ))}
    </div>
  );
}
