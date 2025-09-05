import { EventColor } from '../types';

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const getTimeSlots = (): string[] => {
  const slots: string[] = [];
  for (let hour = 6; hour <= 22; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
  }
  return slots;
};

export const getColorClasses = (color: EventColor) => {
  const colorMap = {
    blue: {
      bg: 'bg-blue-100',
      border: 'border-blue-300',
      text: 'text-blue-800'
    },
    green: {
      bg: 'bg-green-100',
      border: 'border-green-300',
      text: 'text-green-800'
    },
    red: {
      bg: 'bg-red-100',
      border: 'border-red-300',
      text: 'text-red-800'
    }
  };

  return colorMap[color];
};