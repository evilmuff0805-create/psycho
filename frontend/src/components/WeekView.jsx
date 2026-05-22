import DayColumn from './DayColumn';

export default function WeekView({ weekMonday, todos, onAdd, onToggle, onDelete, onEdit }) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekMonday);
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <div className="week-view">
      {days.map((date) => {
        const dateStr = toIsoDate(date);
        const dayTodos = todos.filter((t) => t.todoDate === dateStr);
        return (
          <DayColumn
            key={dateStr}
            date={date}
            todos={dayTodos}
            onAdd={(title, time, priority, team) => onAdd(title, time, dateStr, priority, team)}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        );
      })}
    </div>
  );
}

function toIsoDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
