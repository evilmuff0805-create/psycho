import DayHeader from './DayHeader';
import TodoItem from './TodoItem';
import AddTodoForm from './AddTodoForm';

const TEAMS = [
  { key: 'combined', label: '합본편집팀' },
  { key: 'master', label: '마스터팀' },
];

export default function DayColumn({ date, todos, onAdd, onToggle, onDelete, onEdit }) {
  const today = new Date();
  const isToday =
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate();

  return (
    <div className={`day-column${isToday ? ' today' : ''}`}>
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
