export type EventColor = 'blue' | 'green' | 'red';

export interface Event {
  id: string;
  title: string;
  description: string;
  startDayOfWeek: number; // 0 = Monday, 6 = Sunday
  endDayOfWeek: number;   // 0 = Monday, 6 = Sunday
  startTime: string;      // format 'HH:mm'
  endTime: string;        // format 'HH:mm'
  color: EventColor;
  isMultiDay: boolean;    // Indicates if the event spans multiple days
}

export interface EventPosition {
  left: number;
  width: number;
  zIndex: number;
}

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}