import React, { useState } from 'react';
import { Plus, Check, X, ListTodo, Trash2 } from 'lucide-react';
import { TodoItem } from '../types';

interface TodoListProps {
  todos: TodoItem[];
  onAddTodo: (text: string) => void;
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onClearCompleted: () => void;
}

const TodoList: React.FC<TodoListProps> = ({
  todos,
  onAddTodo,
  onToggleTodo,
  onDeleteTodo,
  onClearCompleted
}) => {
  const [newTodo, setNewTodo] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    
    onAddTodo(newTodo.trim());
    setNewTodo('');
    setIsAdding(false);
  };

  const completedTodos = todos.filter(todo => todo.completed);
  const incompleteTodos = todos.filter(todo => !todo.completed);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <ListTodo className="w-6 h-6 text-gray-700 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900">To-Do List</h2>
          <span className="ml-3 px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
            {incompleteTodos.length}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          {completedTodos.length > 0 && (
            <button
              onClick={onClearCompleted}
              className="flex items-center px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 text-sm"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Clear Completed
            </button>
          )}
          
          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Item
            </button>
          )}
        </div>
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Enter new todo item..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
            <button
              type="submit"
              className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setNewTodo('');
              }}
              className="p-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors duration-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {incompleteTodos.map((todo) => (
          <div
            key={todo.id}
            className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-150"
          >
            <button
              onClick={() => onToggleTodo(todo.id)}
              className="w-5 h-5 border-2 border-gray-300 rounded hover:border-green-500 transition-colors duration-200 flex-shrink-0"
            />
            <span className="flex-1 text-gray-700">{todo.text}</span>
            <button
              onClick={() => onDeleteTodo(todo.id)}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}

        {completedTodos.length > 0 && (
          <>
            <div className="border-t border-gray-200 mt-6 pt-4">
              <h3 className="text-sm font-medium text-gray-500 mb-3">
                Completed ({completedTodos.length})
              </h3>
              {completedTodos.map((todo) => (
                <div
                  key={todo.id}
                  className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg opacity-75 hover:opacity-100 transition-opacity duration-150 mb-2"
                >
                  <button
                    onClick={() => onToggleTodo(todo.id)}
                    className="w-5 h-5 bg-green-500 text-white rounded flex items-center justify-center flex-shrink-0"
                  >
                    <Check className="w-3 h-3" />
                  </button>
                  <span className="flex-1 text-gray-600 line-through">{todo.text}</span>
                  <button
                    onClick={() => onDeleteTodo(todo.id)}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}

        {todos.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <ListTodo className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No todo items yet. Add one to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodoList;