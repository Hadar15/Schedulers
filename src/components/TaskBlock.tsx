import React, { useState } from 'react';
import { Task, TaskPosition } from '../types';
import { getColorClasses } from '../utils';

interface TaskBlockProps {
  task: Task;
  position: TaskPosition;
  onEdit: (task: Task) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  currentTimeSlot: string;
}

const TaskBlock: React.FC<TaskBlockProps> = ({
  task,
  position,
  onEdit,
  onUpdate,
  currentTimeSlot
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const colorClasses = getColorClasses(task.color);
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(task);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const isFirstSlot = currentTimeSlot === task.startTime;
  const taskStartHour = parseInt(task.startTime.split(':')[0]);
  const taskEndHour = parseInt(task.endTime.split(':')[0]);
  const duration = taskEndHour - taskStartHour;

  const style = {
    left: `${position.left}%`,
    width: `${position.width}%`,
    height: isFirstSlot ? `${duration * 4}rem` : '0px',
    zIndex: position.zIndex
  };

  if (!isFirstSlot) {
    return null;
  }

  return (
    <div
      className={`absolute rounded-md shadow-sm border transition-all duration-200 cursor-pointer hover:shadow-md ${
        colorClasses.bg
      } ${colorClasses.border} ${
        isDragging ? 'scale-105 shadow-lg' : ''
      }`}
      style={style}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={() => setIsDragging(false)}
    >
      <div className="p-2 h-full overflow-hidden">
        <div className={`font-semibold text-sm leading-tight ${colorClasses.text}`}>
          {task.title}
        </div>
        <div className={`text-xs mt-1 opacity-75 ${colorClasses.text}`}>
          {task.startTime} - {task.endTime}
        </div>
        {task.description && (
          <div className={`text-xs mt-1 opacity-60 ${colorClasses.text}`}>
            {task.description}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskBlock;