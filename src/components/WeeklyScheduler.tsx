import { useState, useEffect } from 'react';
import React from 'react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
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

  // Subscribe to Firestore events and todos collections
  useEffect(() => {
    const unsubscribeEvents = onSnapshot(collection(db, 'events'), (snapshot) => {
      const eventsList: Event[] = [];
      snapshot.forEach((doc) => {
        eventsList.push({ id: doc.id, ...doc.data() } as Event);
      });
      setEvents(eventsList);
    });

    // Subscribe to Firestore todos collection
    const unsubscribeTodos = onSnapshot(collection(db, 'todos'), (snapshot) => {
      const todosList: TodoItem[] = [];
      snapshot.forEach((doc) => {
        todosList.push({ id: doc.id, ...doc.data() } as TodoItem);
      });
      setTodos(todosList);
    });

    // Cleanup subscriptions
    return () => {
      unsubscribeEvents();
      unsubscribeTodos();
    };
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

  const handleSaveEvent = async (eventData: Omit<Event, 'id'>) => {
    if (editingEvent) {
      // Update existing event
      await updateDoc(doc(db, 'events', editingEvent.id), eventData);
    } else {
      // Add new event
      await addDoc(collection(db, 'events'), eventData);
    }
    setIsModalOpen(false);
    setEditingEvent(null);
  };

  const handleDeleteEvent = async () => {
    if (editingEvent) {
      await deleteDoc(doc(db, 'events', editingEvent.id));
      setIsModalOpen(false);
      setEditingEvent(null);
    }
  };

  const handleUpdateEvent = async (id: string, updates: Partial<Event>) => {
    await updateDoc(doc(db, 'events', id), updates);
  };

  const handleAddTodo = async (text: string) => {
    const newTodo: Omit<TodoItem, 'id'> = {
      text,
      completed: false,
      createdAt: new Date().toISOString()
    };
    await addDoc(collection(db, 'todos'), newTodo);
  };

  const handleToggleTodo = async (id: string) => {
    const todoRef = doc(db, 'todos', id);
    const todo = todos.find(t => t.id === id);
    if (todo) {
      await updateDoc(todoRef, {
        completed: !todo.completed
      });
    }
  };

  const handleDeleteTodo = async (id: string) => {
    await deleteDoc(doc(db, 'todos', id));
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    // Delete completed todos one by one
    for (const todo of completedTodos) {
      await deleteDoc(doc(db, 'todos', todo.id));
    }
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