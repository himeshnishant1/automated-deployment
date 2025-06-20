import { useState } from 'react';
import PropTypes from 'prop-types';
import { 
  CheckCircle, 
  RadioButtonUnchecked, 
  Delete, 
  Edit, 
  Save, 
  Cancel,
  Add,
  ListAlt
} from '@mui/icons-material';
import useTodos from '../hooks/useTodos';

function TodoModule() {
  const { todos, loading, error, addTodo, toggleTodo, deleteTodo, updateTodo } = useTodos(5);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [showFullList, setShowFullList] = useState(false);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;
    
    setIsAdding(true);
    try {
      await addTodo(newTodoTitle.trim());
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
      await updateTodo(id, { title: editTitle.trim() });
      setEditingId(null);
      setEditTitle('');
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleTodo(id);
    } catch (error) {
      console.error('Failed to toggle todo:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      try {
        await deleteTodo(id);
      } catch (error) {
        console.error('Failed to delete todo:', error);
      }
    }
  };

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  if (loading) {
    return (
      <div className="todo-module">
        <div className="todo-module-header">
          <h3>Todo List</h3>
        </div>
        <div className="todo-module-content">
          <p>Loading todos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="todo-module">
        <div className="todo-module-header">
          <h3>Todo List</h3>
        </div>
        <div className="todo-module-content">
          <p className="todo-error">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="todo-module">
      <div className="todo-module-header">
        <h3>Todo List</h3>
        <button
          onClick={() => setShowFullList(!showFullList)}
          className="todo-view-all-button"
          title={showFullList ? 'Show summary' : 'View all todos'}
        >
          <ListAlt />
        </button>
      </div>

      <div className="todo-module-content">
        {/* Add Todo Form */}
        <form onSubmit={handleAddTodo} className="todo-add-form-compact">
          <div className="todo-input-group-compact">
            <input
              type="text"
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              placeholder="Add a new todo..."
              className="todo-input-compact"
              disabled={isAdding}
            />
            <button
              type="submit"
              className="todo-add-button-compact"
              disabled={!newTodoTitle.trim() || isAdding}
            >
              <Add />
            </button>
          </div>
        </form>

        {/* Todo Items */}
        <div className="todo-items-compact">
          {activeTodos.length === 0 && completedTodos.length === 0 ? (
            <div className="todo-empty-compact">
              <p>No todos yet. Add one above!</p>
            </div>
          ) : (
            <>
              {/* Active Todos */}
              {activeTodos.slice(0, showFullList ? activeTodos.length : 3).map(todo => (
                <div key={todo.id} className="todo-item-compact">
                  <button
                    onClick={() => handleToggle(todo.id)}
                    className="todo-toggle-button-compact"
                    title="Mark as complete"
                  >
                    <RadioButtonUnchecked className="todo-check-icon-compact" />
                  </button>
                  
                  <div className="todo-content-compact">
                    {editingId === todo.id ? (
                      <div className="todo-edit-group-compact">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="todo-edit-input-compact"
                          autoFocus
                        />
                        <button
                          onClick={() => handleEditSave(todo.id)}
                          className="todo-save-button-compact"
                          disabled={!editTitle.trim()}
                        >
                          <Save />
                        </button>
                        <button
                          onClick={handleEditCancel}
                          className="todo-cancel-button-compact"
                        >
                          <Cancel />
                        </button>
                      </div>
                    ) : (
                      <span className="todo-title-compact">{todo.title}</span>
                    )}
                  </div>

                  <div className="todo-actions-compact">
                    <button
                      onClick={() => handleEditStart(todo)}
                      className="todo-edit-button-compact"
                      title="Edit todo"
                      disabled={editingId !== null}
                    >
                      <Edit />
                    </button>
                    <button
                      onClick={() => handleDelete(todo.id)}
                      className="todo-delete-button-compact"
                      title="Delete todo"
                      disabled={editingId !== null}
                    >
                      <Delete />
                    </button>
                  </div>
                </div>
              ))}

              {/* Completed Todos (only show in full view) */}
              {showFullList && completedTodos.length > 0 && (
                <div className="todo-completed-section">
                  <h4 className="todo-completed-title">Completed</h4>
                  {completedTodos.map(todo => (
                    <div key={todo.id} className="todo-item-compact completed">
                      <button
                        onClick={() => handleToggle(todo.id)}
                        className="todo-toggle-button-compact"
                        title="Mark as incomplete"
                      >
                        <CheckCircle className="todo-check-icon-compact completed" />
                      </button>
                      
                      <div className="todo-content-compact">
                        <span className="todo-title-compact">{todo.title}</span>
                      </div>

                      <div className="todo-actions-compact">
                        <button
                          onClick={() => handleDelete(todo.id)}
                          className="todo-delete-button-compact"
                          title="Delete todo"
                        >
                          <Delete />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Show more/less indicator */}
              {!showFullList && activeTodos.length > 3 && (
                <div className="todo-more-indicator">
                  <p>+{activeTodos.length - 3} more active todos</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default TodoModule; 