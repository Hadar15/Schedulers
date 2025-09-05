import { useState, useEffect } from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import React from 'react';
import CalendarHeader from './CalendarHeader';
import CalendarGrid from './CalendarGrid';
import EventModal from './EventModal';
import TodoList from './TodoList';
import FloatingAddButton from './FloatingAddButton';
import { Event, TodoItem } from '../types';
import { generateId } from '../utils';

function WeeklyScheduler() {
  const [events, setEvents] = useState<Event[]>([]);
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [modalDefaults, setModalDefaults] = useState<{ 
    startDayOfWeek?: number;
    endDayOfWeek?: number;
    startTime?: string;
    endTime?: string;
  }>({});

  // Load data from localStorage on mount or set default events
  useEffect(() => {
    const savedEvents = localStorage.getItem('scheduler-events');
    const savedTodos = localStorage.getItem('scheduler-todos');
    
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    } else {
      // Add some default events if none exist
      const defaultEvents: Event[] = [
        {
          id: generateId(),
          title: 'Team Meeting',
          description: 'Daily standup with the team',
          startDayOfWeek: 1, // Tuesday
          endDayOfWeek: 1,
          startTime: '09:00',
          endTime: '10:00',
          color: 'blue',
          isMultiDay: false
        },
        {
          id: generateId(),
          title: 'Training Workshop',
          description: 'Comprehensive training session',
          startDayOfWeek: 1, // Tuesday
          endDayOfWeek: 3,   // Thursday
          startTime: '14:00',
          endTime: '11:00',
          color: 'red',
          isMultiDay: true
        },
        {
          id: generateId(),
          title: 'Project Planning',
          description: 'Multi-day planning session',
          startDayOfWeek: 2, // Wednesday
          endDayOfWeek: 4,   // Friday
          startTime: '09:00',
          endTime: '16:00',
          color: 'green',
          isMultiDay: true
        },
        {
          id: generateId(),
          title: 'Client Meeting',
          description: 'Product review',
          startDayOfWeek: 3, // Thursday
          endDayOfWeek: 3,
          startTime: '10:00',
          endTime: '11:00',
          color: 'blue',
          isMultiDay: false
        }
      ];
      setEvents(defaultEvents);
    }

    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // Save events to localStorage
  useEffect(() => {
    localStorage.setItem('scheduler-events', JSON.stringify(events));
  }, [events]);

  // Save todos to localStorage
  useEffect(() => {
    localStorage.setItem('scheduler-todos', JSON.stringify(todos));
  }, [todos]);

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleAddEvent = (startDayOfWeek?: number, startTime?: string) => {
    setEditingEvent(null);
    const endTime = startTime ? 
      `${(parseInt(startTime.split(':')[0]) + 1).toString().padStart(2, '0')}:00` : 
      '10:00';
    setModalDefaults({ 
      startDayOfWeek,
      endDayOfWeek: startDayOfWeek,
      startTime, 
      endTime
    });
    setIsModalOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setModalDefaults({});
    setIsModalOpen(true);
  };

  const handleSaveEvent = (eventData: Omit<Event, 'id'>) => {
    if (editingEvent) {
      setEvents(events.map((event: Event) => 
        event.id === editingEvent.id 
          ? { ...eventData, id: editingEvent.id }
          : event
      ));
    } else {
      const newEvent: Event = {
        ...eventData,
        id: generateId()
      };
      setEvents([...events, newEvent]);
    }
    setIsModalOpen(false);
    setEditingEvent(null);
  };

  const handleDeleteEvent = () => {
    if (editingEvent) {
      setEvents(events.filter((event: Event) => event.id !== editingEvent.id));
      setIsModalOpen(false);
      setEditingEvent(null);
    }
  };

  const handleUpdateEvent = (id: string, updates: Partial<Event>) => {
    setEvents(events.map(event => 
      event.id === id ? { ...event, ...updates } : event
    ));
  };

  const handleAddTodo = (text: string) => {
    const newTodo: TodoItem = {
      id: generateId(),
      text,
      completed: false,
      createdAt: new Date().toISOString()
    };
    setTodos([...todos, newTodo]);
  };

  const handleToggleTodo = (id: string) => {
    setTodos(todos.map((todo: TodoItem) => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const handleDeleteTodo = (id: string) => {
    setTodos(todos.filter((todo: TodoItem) => todo.id !== id));
  };

  const handleClearCompleted = () => {
    setTodos(todos.filter((todo: TodoItem) => !todo.completed));
  };

  return (
    <div className="max-w-7xl mx-auto p-4 pb-20">
  <CalendarHeader weekDays={weekDays} />
      
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <CalendarGrid
          weekDays={weekDays}
          events={events}
          onAddEvent={handleAddEvent}
          onEditEvent={handleEditEvent}
          onUpdateEvent={handleUpdateEvent}
        />
      </div>

      <TodoList
        todos={todos}
        onAddTodo={handleAddTodo}
        onToggleTodo={handleToggleTodo}
        onDeleteTodo={handleDeleteTodo}
        onClearCompleted={handleClearCompleted}
      />

      <FloatingAddButton onClick={() => handleAddEvent()} />

      {isModalOpen && (
        <EventModal
          event={editingEvent}
          defaults={modalDefaults}
          onSave={handleSaveEvent}
          onDelete={editingEvent ? handleDeleteEvent : undefined}
          onClose={() => {
            setIsModalOpen(false);
            setEditingEvent(null);
          }}
        />
      )}
    </div>
  );
};

export default WeeklyScheduler;