const BASE = import.meta.env.VITE_API_URL ?? '';

async function request(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || res.statusText);
  }
  return res.json();
}

export const getTodos = (week) => request('GET', `/api/todos?week=${week}`);

export const createTodo = (title, time, todoDate, priority, team) =>
  request('POST', '/api/todos', { title, time, todoDate, priority, team });

export const updateTodo = (id, patch) =>
  request('PUT', `/api/todos/${id}`, patch);

export const deleteTodo = (id) =>
  request('DELETE', `/api/todos/${id}`);
