import { ScheduledPost, BusinessProfile } from '@/types';

/**
 * Formats a Date object into ICS iCalendar timestamp (YYYYMMDDTHHmmssZ)
 */
function formatDateToICS(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

/**
 * Parses user scheduled date and time into a realistic JavaScript Date object
 */
export function parseScheduleDateTime(scheduledDate: string, scheduledTime: string): { start: Date; end: Date } {
  const now = new Date();
  let targetDate = new Date(now);

  if (scheduledDate.toLowerCase().includes('tomorrow')) {
    targetDate.setDate(targetDate.getDate() + 1);
  } else if (scheduledDate.toLowerCase().includes('upcoming')) {
    targetDate.setDate(targetDate.getDate() + 2);
  }

  // Parse time (e.g. "6:30 PM (Peak)" -> 18:30)
  const timeMatch = scheduledTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (timeMatch) {
    let hours = parseInt(timeMatch[1], 10);
    const minutes = parseInt(timeMatch[2], 10);
    const meridian = timeMatch[3].toUpperCase();

    if (meridian === 'PM' && hours < 12) hours += 12;
    if (meridian === 'AM' && hours === 12) hours = 0;

    targetDate.setHours(hours, minutes, 0, 0);
  } else {
    targetDate.setHours(18, 30, 0, 0); // Default to 6:30 PM peak
  }

  // If time has already passed today, push to tomorrow
  if (targetDate.getTime() < now.getTime() && scheduledDate.toLowerCase().includes('today')) {
    targetDate.setDate(targetDate.getDate() + 1);
  }

  const endDate = new Date(targetDate.getTime() + 30 * 60 * 1000); // 30 minutes duration
  return { start: targetDate, end: endDate };
}

/**
 * Generates and triggers download of a valid RFC 5545 .ics Calendar file
 */
export function downloadICSFile(post: ScheduledPost, business: BusinessProfile) {
  const { start, end } = parseScheduleDateTime(post.scheduledDate, post.scheduledTime);
  const startStr = formatDateToICS(start);
  const endStr = formatDateToICS(end);
  const nowStr = formatDateToICS(new Date());

  const brandName = business.companyName || business.name || 'Marketing Engine';
  const summary = `🚀 ${brandName} Reel: "${post.hook.slice(0, 40)}..."`;
  const description = [
    `Brand: ${brandName}`,
    `Hook: ${post.hook}`,
    `Caption: ${post.caption}`,
    `Hashtags: ${post.hashtags.join(' ')}`,
    `Video Asset: ${post.videoUrl}`,
    `Target: Instagram Reels (@${brandName.toLowerCase().replace(/[^a-z0-9]/g, '')})`,
    `\nScheduled via business-marketing-engine`,
  ].join('\\n');

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//business-marketing-engine//Viral Reel Scheduler//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:bme-${post.id}-${Date.now()}@marketingengine.app`,
    `DTSTAMP:${nowStr}`,
    `DTSTART:${startStr}`,
    `DTEND:${endStr}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    'STATUS:CONFIRMED',
    'BEGIN:VALARM',
    'TRIGGER:-PT15M',
    'ACTION:DISPLAY',
    `DESCRIPTION:Reminder: Time to publish your ${brandName} Instagram Reel!`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `reel-${post.id}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}
