CREATE TABLE IF NOT EXISTS todos (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries by user_id
CREATE INDEX IF NOT EXISTS idx_todos_user_id ON todos(user_id);

-- Create index for completed status
CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed);

-- Create index for created_at for sorting
CREATE INDEX IF NOT EXISTS idx_todos_created_at ON todos(created_at); 