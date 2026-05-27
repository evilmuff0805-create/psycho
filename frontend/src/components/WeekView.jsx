import { useState } from 'react';
import DayColumn from './DayColumn';

export default function WeekView({ weekMonday, todos, onAdd, onToggle, onDelete, onEdit }) {
  const [dragging, setDragging] = useState(null); // { id, originalDate }
  const [dragOverDate, setDragOverDate] = useState(null);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekMonday);
    d.setDate(d.getDate() + i);
    return d;
  });

  function handleDragStart(todo) {
    setDragging({ id: todo.id, originalDate: todo.todoDate });
  }

  function handleDragEnd() {
    setDragging(null);
    setDragOverDate(null);
  }

  function handleDrop(targetDate) {
    if (dragging && targetDate !== dragging.originalDate) {
      onEdit(dragging.id, { todoDate: targetDate });
    }
    setDragging(null);
    setDragOverDate(null);
  }

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
            draggingId={dragging?.id ?? null}
            isDragOver={dragOverDate === dateStr && dragging !== null}
            onTodoDragStart={handleDragStart}
            onDragOver={setDragOverDate}
            onDrop={handleDrop}
            onDragEnd={handleDragEnd}
          />
        );
      })}
    </div>
  );
}

function toIsoDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
