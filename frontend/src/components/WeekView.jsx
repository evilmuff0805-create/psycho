import { useState } from 'react';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import DayColumn from './DayColumn';

export default function WeekView({ weekMonday, todos, onAdd, onToggle, onDelete, onEdit }) {
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekMonday);
    d.setDate(d.getDate() + i);
    return d;
  });

  const activeTodo = todos.find((t) => t.id === activeId);

  function handleDragStart({ active }) {
    setActiveId(active.id);
  }

  function handleDragEnd({ active, over }) {
    setActiveId(null);
    if (!over) return;
    const todo = todos.find((t) => t.id === active.id);
    if (!todo || todo.todoDate === over.id) return;
    onEdit(active.id, { todoDate: over.id });
  }

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
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
      <DragOverlay dropAnimation={null}>
        {activeTodo ? (
          <div className="drag-overlay-card">{activeTodo.title}</div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

function toIsoDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
