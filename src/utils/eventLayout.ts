import type { Event } from '../types/index';

export interface EventWithLayout extends Event {
  column: number;
  totalColumns: number;
}

function normalizeDay(day: number): number {
  return (day + 7) % 7;
}

function isInRange(value: number, start: number, end: number): boolean {
  start = normalizeDay(start);
  end = normalizeDay(end);
  value = normalizeDay(value);

  if (end >= start) {
    return value >= start && value <= end;
  } else {
    // Handles wrap-around case (e.g., Sat-Sun-Mon)
    return value >= start || value <= end;
  }
}

function getTimeInMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + (minutes || 0);
}

function doEventsOverlap(event1: Event, event2: Event, dayIndex: number): boolean {
  const day1Start = event1.startDayOfWeek;
  const day1End = event1.endDayOfWeek;
  const day2Start = event2.startDayOfWeek;
  const day2End = event2.endDayOfWeek;

  // Check if the current day is within both events' day ranges
  const isDay1Range = isInRange(dayIndex, day1Start, day1End);
  const isDay2Range = isInRange(dayIndex, day2Start, day2End);

  if (!isDay1Range || !isDay2Range) {
    return false;
  }

  // Get times in minutes for easier comparison
  const time1Start = getTimeInMinutes(event1.startTime);
  const time1End = getTimeInMinutes(event1.endTime);
  const time2Start = getTimeInMinutes(event2.startTime);
  const time2End = getTimeInMinutes(event2.endTime);

  // For same day events
  if (dayIndex === day1Start && dayIndex === day2Start) {
    return !(time1End <= time2Start || time2End <= time1Start);
  }

  // For the start day of event1
  if (dayIndex === day1Start) {
    return time1Start <= time2End;
  }

  // For the start day of event2
  if (dayIndex === day2Start) {
    return time2Start <= time1End;
  }

  // For middle days or end days
  return true;
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
