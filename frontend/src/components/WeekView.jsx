import { useState, useRef } from 'react';
import DayColumn from './DayColumn';

export default function WeekView({ weekMonday, todos, onAdd, onToggle, onDelete, onEdit }) {
  const draggingRef = useRef(null);
  const [draggingId, setDraggingId] = useState(null);
  const [dragOverDate, setDragOverDate] = useState(null);

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekMonday);
    d.setDate(d.getDate() + i);
    return d;
  });

  function handleDragStart(todo) {
    draggingRef.current = { id: todo.id, originalDate: todo.todoDate };
    setDraggingId(todo.id);
  }

  function handleDragEnd() {
    draggingRef.current = null;
    setDraggingId(null);
    setDragOverDate(null);
  }

  function handleDrop(targetDate) {
    const drag = draggingRef.current;
    if (drag && targetDate !== drag.originalDate) {
      onEdit(drag.id, { todoDate: targetDate });
    }
    draggingRef.current = null;
    setDraggingId(null);
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
            draggingId={draggingId}
            isDragOver={dragOverDate === dateStr && draggingId !== null}
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
