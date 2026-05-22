import { useState, useEffect, useCallback } from 'react';
import { getTodos, createTodo, updateTodo, deleteTodo } from '../api';

function toIsoDate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function useTodos(weekMonday) {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const weekKey = toIsoDate(weekMonday);

  const fetchTodos = useCallback(async () => {
    try {
      const data = await getTodos(weekKey);
      setTodos(data);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [weekKey]);

  useEffect(() => {
    setLoading(true);
    fetchTodos();
    const interval = setInterval(fetchTodos, 30_000);
    return () => clearInterval(interval);
  }, [fetchTodos]);

  const addTodo = useCallback(async (title, time, todoDate, priority, team) => {
    const todo = await createTodo(title, time, todoDate, priority, team);
    setTodos((prev) => [...prev, todo]);
  }, []);

  const toggleTodo = useCallback(async (id, completed) => {
    const updated = await updateTodo(id, { completed });
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
  }, []);

  const removeTodo = useCallback(async (id) => {
    await deleteTodo(id);
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const editTodo = useCallback(async (id, patch) => {
    const updated = await updateTodo(id, patch);
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
  }, []);

  const todayStr = toIsoDate(new Date());
  const todayTodos = todos.filter((t) => t.todoDate === todayStr);

  return { todos, todayTodos, loading, error, addTodo, toggleTodo, removeTodo, editTodo };
}
