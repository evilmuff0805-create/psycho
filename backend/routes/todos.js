const express = require('express');
const { pool } = require('../database');

const router = express.Router();

const VALID_PRIORITIES = ['high', 'medium', 'low'];
const VALID_TEAMS = ['combined', 'master'];

function toTodo(row) {
  return {
    id: row.id,
    title: row.title,
    time: row.time,
    todoDate: row.todo_date instanceof Date
      ? row.todo_date.toISOString().split('T')[0]
      : String(row.todo_date).split('T')[0],
    completed: row.completed,
    priority: row.priority || 'medium',
    team: row.team || 'combined',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

router.get('/', async (req, res) => {
  const { week } = req.query;
  if (!week || !/^\d{4}-\d{2}-\d{2}$/.test(week)) {
    return res.status(400).json({ error: 'week query param required (YYYY-MM-DD)' });
  }
  try {
    const result = await pool.query(
      `SELECT * FROM todos
       WHERE todo_date >= $1::date AND todo_date < ($1::date + INTERVAL '7 days')
       ORDER BY todo_date ASC, time ASC NULLS LAST`,
      [week]
    );
    res.json(result.rows.map(toTodo));
  } catch (err) {
    console.error('GET /todos error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', async (req, res) => {
  const { title, time, todoDate, priority, team } = req.body;
  if (!title || !todoDate) {
    return res.status(400).json({ error: 'title and todoDate are required' });
  }
  const safePriority = VALID_PRIORITIES.includes(priority) ? priority : 'medium';
  const safeTeam = VALID_TEAMS.includes(team) ? team : 'combined';
  try {
    const result = await pool.query(
      `INSERT INTO todos (title, time, todo_date, priority, team)
       VALUES ($1, $2, $3::date, $4, $5)
       RETURNING *`,
      [title.trim(), time || null, todoDate, safePriority, safeTeam]
    );
    res.status(201).json(toTodo(result.rows[0]));
  } catch (err) {
    console.error('POST /todos error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid id' });

  const { title, time, todoDate, completed, priority, team } = req.body;

  const fields = [];
  const values = [];
  let idx = 1;

  if (title !== undefined)     { fields.push(`title = $${idx++}`);             values.push(title.trim()); }
  if (time !== undefined)      { fields.push(`time = $${idx++}`);              values.push(time || null); }
  if (todoDate !== undefined)  { fields.push(`todo_date = $${idx++}::date`);   values.push(todoDate); }
  if (completed !== undefined) { fields.push(`completed = $${idx++}`);         values.push(Boolean(completed)); }
  if (priority !== undefined)  {
    fields.push(`priority = $${idx++}`);
    values.push(VALID_PRIORITIES.includes(priority) ? priority : 'medium');
  }
  if (team !== undefined) {
    fields.push(`team = $${idx++}`);
    values.push(VALID_TEAMS.includes(team) ? team : 'combined');
  }

  if (fields.length === 0) return res.status(400).json({ error: 'No fields to update' });

  fields.push(`updated_at = CURRENT_TIMESTAMP`);
  values.push(id);

  try {
    const result = await pool.query(
      `UPDATE todos SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Todo not found' });
    res.json(toTodo(result.rows[0]));
  } catch (err) {
    console.error('PUT /todos/:id error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid id' });

  try {
    const result = await pool.query('DELETE FROM todos WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Todo not found' });
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /todos/:id error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
