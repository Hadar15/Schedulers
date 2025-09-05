import type { Event } from '../types/index';

export interface EventWithLayout extends Event {
  column: number;
  totalColumns: number;
}

function doEventsOverlap(event1: Event, event2: Event, dayIndex: number): boolean {
  // For same day events
  if (!event1.isMultiDay && !event2.isMultiDay && event1.startDayOfWeek === event2.startDayOfWeek) {
    const e1Start = parseInt(event1.startTime.split(':')[0]);
    const e1End = parseInt(event1.endTime.split(':')[0]);
    const e2Start = parseInt(event2.startTime.split(':')[0]);
    const e2End = parseInt(event2.endTime.split(':')[0]);
    
    return !(e1End <= e2Start || e2End <= e1Start);
  }

  // For multi-day events
  if (dayIndex >= Math.min(event1.startDayOfWeek, event2.startDayOfWeek) &&
      dayIndex <= Math.max(event1.endDayOfWeek, event2.endDayOfWeek)) {
    
    // If it's the start day for both events
    if (dayIndex === event1.startDayOfWeek && dayIndex === event2.startDayOfWeek) {
      const e1Start = parseInt(event1.startTime.split(':')[0]);
      const e2Start = parseInt(event2.startTime.split(':')[0]);
      return e1Start === e2Start;
    }
    
    // If it's the end day for both events
    if (dayIndex === event1.endDayOfWeek && dayIndex === event2.endDayOfWeek) {
      const e1End = parseInt(event1.endTime.split(':')[0]);
      const e2End = parseInt(event2.endTime.split(':')[0]);
      return e1End === e2End;
    }
    
    // If one event starts and another continues
    return true;
  }

  return false;
}

function groupOverlappingEvents(events: Event[], dayIndex: number): Event[][] {
  const groups: Event[][] = [];
  
  for (const event of events) {
    let foundGroup = false;
    
    for (const group of groups) {
      if (group.some(groupEvent => doEventsOverlap(groupEvent, event, dayIndex))) {
        group.push(event);
        foundGroup = true;
        break;
      }
    }
    
    if (!foundGroup) {
      groups.push([event]);
    }
  }
  
  return groups;
}

export function calculateEventLayout(events: Event[], dayIndex: number): EventWithLayout[] {
  const groups = groupOverlappingEvents(events, dayIndex);
  
  return groups.flatMap(group => {
    return group.map((event, index) => ({
      ...event,
      column: index,
      totalColumns: group.length
    }));
  });
}
