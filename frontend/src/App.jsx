import { useState, useCallback, useEffect } from 'react';
import WeekNavigation from './components/WeekNavigation';
import WeekView from './components/WeekView';
import NotificationModal from './components/NotificationModal';
import { useTodos } from './hooks/useTodos';
import { useNotification } from './hooks/useNotification';

function getMonday(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function App() {
  const [weekMonday, setWeekMonday] = useState(() => getMonday(new Date()));
  const [showModal, setShowModal] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const { todos, todayTodos, loading, error, addTodo, toggleTodo, removeTodo, editTodo } =
    useTodos(weekMonday);

  const handleNotification = useCallback(() => {
    setShowModal(true);
  }, []);

  useNotification(handleNotification);

  function prevWeek() {
    setWeekMonday((d) => {
      const n = new Date(d);
      n.setDate(n.getDate() - 7);
      return n;
    });
  }

  function nextWeek() {
    setWeekMonday((d) => {
      const n = new Date(d);
      n.setDate(n.getDate() + 7);
      return n;
    });
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>내가 만난 사이코패스</h1>
        <button
          className="dark-toggle"
          onClick={() => setDarkMode((d) => !d)}
          aria-label={darkMode ? '라이트모드로 전환' : '다크모드로 전환'}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </header>

      <WeekNavigation weekMonday={weekMonday} onPrev={prevWeek} onNext={nextWeek} />

      {error && <div className="error-banner">오류: {error}</div>}
      {loading ? (
        <div className="loading">불러오는 중...</div>
      ) : (
        <WeekView
          weekMonday={weekMonday}
          todos={todos}
          onAdd={addTodo}
          onToggle={toggleTodo}
          onDelete={removeTodo}
          onEdit={editTodo}
        />
      )}

      {showModal && (
        <NotificationModal todos={todayTodos} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
