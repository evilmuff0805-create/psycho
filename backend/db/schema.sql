CREATE TABLE IF NOT EXISTS todos (
  id         SERIAL PRIMARY KEY,
  title      TEXT NOT NULL,
  time       TEXT,
  todo_date  DATE NOT NULL,
  completed  BOOLEAN NOT NULL DEFAULT false,
  priority   TEXT NOT NULL DEFAULT 'medium',
  team       TEXT NOT NULL DEFAULT 'combined',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_todo_date ON todos(todo_date);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='todos' AND column_name='priority'
  ) THEN
    ALTER TABLE todos ADD COLUMN priority TEXT NOT NULL DEFAULT 'medium';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name='todos' AND column_name='team'
  ) THEN
    ALTER TABLE todos ADD COLUMN team TEXT NOT NULL DEFAULT 'combined';
  END IF;
END $$;
