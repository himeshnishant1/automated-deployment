import { useState } from 'react';
import PropTypes from 'prop-types';
import { 
  CheckCircle, 
  RadioButtonUnchecked, 
  Delete, 
  Edit, 
  Save, 
  Cancel,
  Add
} from '@mui/icons-material';

function TodoList({ todos, onToggle, onDelete, onUpdate, onAdd, loading, error }) {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;
    
    setIsAdding(true);
    try {
      await onAdd(newTodoTitle.trim());
      setNewTodoTitle('');
    } catch (error) {
      console.error('Failed to add todo:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleEditStart = (todo) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const handleEditSave = async (id) => {
    if (!editTitle.trim()) return;
    
    try {
      await onUpdate(id, { title: editTitle.trim() });
      setEditingId(null);
      setEditTitle('');
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const handleToggle = async (id) => {
    try {
      await onToggle(id);
    } catch (error) {
      console.error('Failed to toggle todo:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      try {
        await onDelete(id);
      } catch (error) {
        console.error('Failed to delete todo:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="todo-list-container">
        <div className="todo-loading">
          <p>Loading todos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="todo-list-container">
        <div className="todo-error">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="todo-list-container">
      {/* Add Todo Form */}
      <form onSubmit={handleAddTodo} className="todo-add-form">
        <div className="todo-input-group">
          <input
            type="text"
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            placeholder="Add a new todo..."
            className="todo-input"
            disabled={isAdding}
          />
          <button
            type="submit"
            className="todo-add-button"
            disabled={!newTodoTitle.trim() || isAdding}
          >
            <Add />
          </button>
        </div>
      </form>

      {/* Todo List */}
      <div className="todo-items">
        {todos.length === 0 ? (
          <div className="todo-empty">
            <p>No todos yet. Add one above!</p>
          </div>
        ) : (
          todos.map(todo => (
            <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              {/* Toggle Complete */}
              <button
                onClick={() => handleToggle(todo.id)}
                className="todo-toggle-button"
                title={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
              >
                {todo.completed ? (
                  <CheckCircle className="todo-check-icon completed" />
                ) : (
                  <RadioButtonUnchecked className="todo-check-icon" />
                )}
              </button>

              {/* Todo Content */}
              <div className="todo-content">
                {editingId === todo.id ? (
                  <div className="todo-edit-group">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="todo-edit-input"
                      autoFocus
                    />
                    <button
                      onClick={() => handleEditSave(todo.id)}
                      className="todo-save-button"
                      disabled={!editTitle.trim()}
                    >
                      <Save />
                    </button>
                    <button
                      onClick={handleEditCancel}
                      className="todo-cancel-button"
                    >
                      <Cancel />
                    </button>
                  </div>
                ) : (
                  <span className="todo-title">{todo.title}</span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="todo-actions">
                <button
                  onClick={() => handleEditStart(todo)}
                  className="todo-edit-button"
                  title="Edit todo"
                  disabled={editingId !== null}
                >
                  <Edit />
                </button>
                <button
                  onClick={() => handleDelete(todo.id)}
                  className="todo-delete-button"
                  title="Delete todo"
                  disabled={editingId !== null}
                >
                  <Delete />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

TodoList.propTypes = {
  todos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      completed: PropTypes.bool.isRequired,
      created_at: PropTypes.string.isRequired,
      updated_at: PropTypes.string.isRequired
    })
  ).isRequired,
  onToggle: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  error: PropTypes.string
};

export default TodoList; 