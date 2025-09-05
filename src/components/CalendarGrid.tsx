import React from 'react';
import { Event } from '../types';
import { useRef } from 'react';
import EventBlock from './EventBlock';
import { getTimeSlots } from '../utils';

interface CalendarGridProps {
  weekDays: string[];
  events: Event[];
  onAddEvent: (startDayOfWeek?: number, startTime?: string) => void;
  onEditEvent: (event: Event) => void;
  onUpdateEvent: (id: string, updates: Partial<Event>) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({
  weekDays,
  events,
  onAddEvent,
  onEditEvent,
}) => {
  const timeSlots = getTimeSlots();

  const handleTimeSlotClick = (dayIdx: number, timeSlot: string) => {
    onAddEvent(dayIdx, timeSlot);
  };

  const handleTimeSlotDoubleClick = (dayIdx: number, timeSlot: string) => {
    onAddEvent(dayIdx, timeSlot);
  };

  return (
    <div className="grid grid-cols-8">
      {/* Time column header */}
      <div className="bg-gray-50 border-b border-gray-200 p-3"></div>
      {/* Day headers */}
      {weekDays.map((day, index) => (
        <div
          key={index}
          className="bg-gray-50 border-b border-l border-gray-200 p-3 text-center"
        >
          <div className="font-semibold text-gray-900">
            {day}
          </div>
        </div>
      ))}

      {/* Time slots and content */}
      {timeSlots.map((timeSlot) => (
        <React.Fragment key={timeSlot}>
          {/* Time label */}
          <div className="bg-gray-50 border-b border-gray-200 p-3 text-right pr-4">
            <div className="text-sm text-gray-600 font-medium">
              {timeSlot}
            </div>
          </div>
          {/* Day columns */}
          {weekDays.map((_, dayIndex) => {
            const currentTimeSlotHour = parseInt(timeSlot.split(':')[0]);
                          const eventsInSlot = events.filter(event => {
                const startHour = parseInt(event.startTime.split(':')[0]);
                const endHour = parseInt(event.endTime.split(':')[0]);
                const currentHour = currentTimeSlotHour;

                if (!event.isMultiDay) {
                  // Single day events
                  return event.startDayOfWeek === dayIndex && currentHour === startHour;
                }

                // Multi-day events
                if (dayIndex === event.startDayOfWeek) {
                  // First day: show at start time
                  return currentHour === startHour;
                } else if (dayIndex === event.endDayOfWeek) {
                  // Last day: show at 6 AM
                  return currentHour === 6;
                } else if (dayIndex > event.startDayOfWeek && dayIndex < event.endDayOfWeek) {
                  // Middle days: show at 6 AM
                  return currentHour === 6;
                }
                
                return false;
              });
            return (
              <div
                key={dayIndex}
                className="border-b border-l border-gray-200 p-1 min-h-[4rem] relative"
                onClick={() => handleTimeSlotClick(dayIndex, timeSlot)}
                onDoubleClick={() => handleTimeSlotDoubleClick(dayIndex, timeSlot)}
              >
                {eventsInSlot.map((event: Event, index: number) => (
                  <div 
                    key={event.id} 
                    style={{
                      width: `${100 / eventsInSlot.length}%`,
                      left: `${(index * 100) / eventsInSlot.length}%`,
                      position: 'absolute',
                      top: 0,
                      bottom: 0,
                      padding: '0.25rem'
                    }}
                  >
                    <EventBlock
                      event={event}
                      onEdit={onEditEvent}
                      currentTimeSlot={timeSlot}
                      currentDayIndex={dayIndex}
                    />
                  </div>
                ))}
              </div>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
};

export default CalendarGrid;