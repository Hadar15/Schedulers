import { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import type { Event, EventColor } from '../types';
import { getColorClasses } from '../utils';
import type { ChangeEvent, FormEvent } from 'react';

interface Defaults {
  startDayOfWeek?: number;
  endDayOfWeek?: number;
  startTime?: string;
  endTime?: string;
}

interface EventModalProps {
  event?: Event | null;
  defaults?: Defaults;
  onSave: (event: Omit<Event, 'id'>) => void;
  onDelete?: () => void;
  onClose: () => void;
}

function EventModal({
  event,
  defaults = {},
  onSave,
  onDelete,
  onClose
}: EventModalProps) {
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    startDayOfWeek: number;
    endDayOfWeek: number;
    startTime: string;
    endTime: string;
    color: EventColor;
    isMultiDay: boolean;
  }>({
    title: '',
    description: '',
    startDayOfWeek: 0,
    endDayOfWeek: 0,
    startTime: '09:00',
    endTime: '10:00',
    color: 'blue',
    isMultiDay: false,
  });

  const colors: EventColor[] = ['blue', 'green', 'red'];
  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description,
        startDayOfWeek: event.startDayOfWeek,
        endDayOfWeek: event.endDayOfWeek,
        startTime: event.startTime,
        endTime: event.endTime,
        color: event.color,
        isMultiDay: event.isMultiDay
      });
    } else if (defaults.startDayOfWeek !== undefined) {
      setFormData((prev) => ({
        ...prev,
        startDayOfWeek: defaults.startDayOfWeek ?? prev.startDayOfWeek,
        endDayOfWeek: defaults.endDayOfWeek ?? prev.startDayOfWeek,
        startTime: defaults.startTime ?? prev.startTime,
        endTime: defaults.endTime ?? prev.endTime,
        isMultiDay: defaults.endDayOfWeek !== undefined && defaults.endDayOfWeek !== defaults.startDayOfWeek
      }));
    }
  }, [event, defaults]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    // Convert times to standard format (HH:mm)
    const standardizeTime = (time: string) => {
      const [hours, minutes] = time.split(':');
      return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
    };

    const startTime = standardizeTime(formData.startTime);
    const endTime = standardizeTime(formData.endTime);

    // Basic validation
    if (formData.endDayOfWeek < formData.startDayOfWeek) {
      alert('End day must be after or same as start day');
      return;
    }

    if (formData.endDayOfWeek === formData.startDayOfWeek && 
        endTime <= startTime) {
      alert('End time must be after start time on the same day');
      return;
    }

    const isMultiDay = formData.endDayOfWeek !== formData.startDayOfWeek;

    const eventData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      startDayOfWeek: formData.startDayOfWeek,
      endDayOfWeek: formData.endDayOfWeek,
      startTime: startTime,
      endTime: endTime,
      color: formData.color,
      isMultiDay
    };

    onSave(eventData);
    onClose();
  };
  // Semua fungsi terkait tanggal dihapus, hanya hari dan jam digunakan

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {event ? 'Edit Event' : 'Create New Event'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Enter event title..."
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Add description..."
              rows={3}
            />
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Day</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.startDayOfWeek}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  const newStartDay = parseInt(e.target.value);
                  setFormData(prev => ({
                    ...prev,
                    startDayOfWeek: newStartDay,
                    endDayOfWeek: Math.max(newStartDay, prev.endDayOfWeek),
                    isMultiDay: newStartDay !== prev.endDayOfWeek
                  }));
                }}
                required
              >
                {weekDays.map((day, idx) => (
                  <option key={day} value={idx}>{day}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">End Day</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.endDayOfWeek}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  const newEndDay = parseInt(e.target.value);
                  setFormData(prev => ({
                    ...prev,
                    endDayOfWeek: newEndDay,
                    isMultiDay: prev.startDayOfWeek !== newEndDay
                  }));
                }}
                required
              >
                {weekDays.map((day, idx) => (
                  <option key={day} value={idx} disabled={idx < formData.startDayOfWeek}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <input
                type="time"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.startTime}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, startTime: e.target.value })}
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <input
                type="time"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.endTime}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, endTime: e.target.value })}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
            <div className="flex space-x-2">
              {colors.map(color => (
                <button
                  key={color}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 ${formData.color === color ? 'border-blue-500' : 'border-gray-300'} ${getColorClasses(color).bg}`}
                  onClick={() => setFormData({ ...formData, color })}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            {onDelete && (
              <button
                type="button"
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200"
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this event?')) {
                    onDelete();
                  }
                }}
              >
                <Trash2 className="w-4 h-4 inline mr-1" /> Delete
              </button>
            )}
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EventModal;