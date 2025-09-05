import React, { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import { Task, TaskColor } from '../types';
import { getColorClasses, getDayName } from '../utils';

interface TaskModalProps {
  task?: Task | null;
  defaultDay?: number;
  defaultTime?: string;
  onSave: (task: Omit<Task, 'id'>) => void;
  onDelete?: () => void;
  onClose: () => void;
}

const TaskModal: React.FC<TaskModalProps> = ({
  task,
  defaultDay = 0,
  defaultTime = '09:00',
  onSave,
  onDelete,
  onClose
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dayOfWeek: defaultDay,
    startTime: defaultTime,
    endTime: '10:00',
    color: 'blue' as TaskColor
  });

  const colors: TaskColor[] = ['blue', 'green', 'purple', 'pink', 'yellow', 'red'];
  const weekDays = Array.from({ length: 7 }, (_, i) => getDayName(new Date(2024, 0, 1 + i)));

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        dayOfWeek: task.dayOfWeek,
        startTime: task.startTime,
        endTime: task.endTime,
        color: task.color
      });
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    onSave(formData);
  };

  const handleTimeChange = (field: 'startTime' | 'endTime', value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Auto-adjust end time if start time is changed to be after end time
      if (field === 'startTime' && value >= newData.endTime) {
        const startHour = parseInt(value.split(':')[0]);
        newData.endTime = `${(startHour + 1).toString().padStart(2, '0')}:00`;
      }
      
      return newData;
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {task ? 'Edit Task' : 'Add New Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter task title..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Add description..."
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Day of Week
            </label>
            <select
              value={formData.dayOfWeek}
              onChange={(e) => setFormData({ ...formData, dayOfWeek: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              {weekDays.map((day, index) => (
                <option key={index} value={index}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time
              </label>
              <select
                value={formData.startTime}
                onChange={(e) => handleTimeChange('startTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                {Array.from({ length: 17 }, (_, i) => {
                  const hour = i + 6;
                  const time = `${hour.toString().padStart(2, '0')}:00`;
                  return (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Time
              </label>
              <select
                value={formData.endTime}
                onChange={(e) => handleTimeChange('endTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                {Array.from({ length: 17 }, (_, i) => {
                  const hour = i + 6;
                  const time = `${hour.toString().padStart(2, '0')}:00`;
                  return (
                    <option key={time} value={time} disabled={time <= formData.startTime}>
                      {time}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Color Tag
            </label>
            <div className="grid grid-cols-6 gap-2">
              {colors.map((color) => {
                const colorClasses = getColorClasses(color);
                return (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-8 h-8 rounded-full transition-all duration-200 ${
                      colorClasses.bg
                    } ${
                      formData.color === color
                        ? 'ring-2 ring-offset-2 ring-gray-400 scale-110'
                        : 'hover:scale-105'
                    }`}
                  />
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            {onDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            )}
            
            <div className="flex items-center space-x-3 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                {task ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;