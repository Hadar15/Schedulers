import React from 'react';

interface CalendarHeaderProps {
  weekDays: string[];
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({
  weekDays
}) => {

  return (
    <div className="flex items-center mb-6">
      <h1 className="text-3xl font-bold text-gray-900">Weekly Scheduler</h1>
    </div>
  );
};

export default CalendarHeader;