import React, { useState } from 'react';
import { Event } from '../types';
import { getColorClasses } from '../utils';

interface EventBlockProps {
  event: Event;
  onEdit: (event: Event) => void;
  currentTimeSlot: string;
  weekDays?: string[];
  currentDayIndex: number;
}

const weekDayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const EventBlock: React.FC<EventBlockProps> = ({
  event,
  onEdit,
  currentTimeSlot,
  currentDayIndex
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const colorClasses = getColorClasses(event.color);
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(event);
  };



  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const startHour = parseInt(event.startTime.split(':')[0]);
  const currentHour = parseInt(currentTimeSlot.split(':')[0]);
  const endHour = parseInt(event.endTime.split(':')[0]);
  
  let height = '4rem'; // Default height for single hour

  // Calculate if we should render the event block
  const dayStartHour = 6;  // Calendar starts at 6 AM
  const dayEndHour = 22;   // Calendar ends at 10 PM
  let shouldRender = false;
  let blockHeight = 0;

  if (!event.isMultiDay) {
    // Single day event
    shouldRender = currentHour === startHour;
    blockHeight = endHour - startHour;
  } else {

    
    // Handle multi-day events
    if (event.startDayOfWeek === event.endDayOfWeek) {
      // Same day event
      shouldRender = currentHour === startHour;
      blockHeight = endHour - startHour;
    } else if (event.startDayOfWeek === currentDayIndex) {
      // First day: from start time to end of day (22:00)
      shouldRender = currentHour === startHour;
      blockHeight = dayEndHour - startHour;
    } else if (event.endDayOfWeek === currentDayIndex) {
      // Last day: from start of day (6:00) to end time
      shouldRender = currentHour === dayStartHour;
      blockHeight = endHour - dayStartHour;
    } else if (currentDayIndex > event.startDayOfWeek && currentDayIndex < event.endDayOfWeek) {
      // Middle days: full day (6:00 - 22:00)
      shouldRender = currentHour === dayStartHour;
      blockHeight = dayEndHour - dayStartHour;
    }
  }

  // Set the height based on calculated block height (4rem per hour)
  height = `${Math.max(1, blockHeight) * 4}rem`;

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      className={`absolute inset-x-0 rounded-md shadow-sm border transition-colors duration-200 cursor-pointer hover:shadow-md ${
        colorClasses.bg
      } ${colorClasses.border} ${isDragging ? 'scale-105 shadow-lg' : ''}`}
      style={{ height }}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={() => setIsDragging(false)}
    >
      <div className="p-2 h-full overflow-hidden">
        <div className={`font-semibold text-sm leading-tight ${colorClasses.text}`}>
          {event.title}
          {event.isMultiDay && 
            <span className="ml-1 text-xs font-normal">
              (Multi-day)
            </span>
          }
        </div>
        <div className={`text-xs mt-1 opacity-75 ${colorClasses.text}`}>
          {event.isMultiDay ? (
            `${weekDayNames[event.startDayOfWeek]} ${event.startTime} - ${weekDayNames[event.endDayOfWeek]} ${event.endTime}`
          ) : (
            `${event.startTime} - ${event.endTime}`
          )}
        </div>
        {event.description && (
          <div className={`text-xs mt-1 opacity-60 ${colorClasses.text} line-clamp-2`}>
            {event.description}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventBlock;