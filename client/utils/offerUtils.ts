// utils/dateUtils.ts
// utils/dateUtils.ts
import type { Offer } from '../schemas/offerSchema';



export type OfferStatus = 'upcoming' | 'active' | 'expired' | 'inactive';
export function formatForDateTimeLocal(isoString?: string) {
  if (!isoString) return '';
  const date = new Date(isoString);
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function toUTCISOString(localDateString?: string) {
  if (!localDateString) return '';
  return new Date(localDateString).toISOString();
}

// utils/productUtils.ts
export function parseProductName(product: string | { name: string } | null | undefined) {
  if (!product) return '';
  try {
    if (typeof product === 'string') {
      const parsed = JSON.parse(product);
      return parsed?.name || '';
    }
    return product?.name || '';
  } catch {
    return '';
  }
}

export function stringifyProductName(name: string) {
  return JSON.stringify({ name: name || '' });
}

export function getOfferStatus(offer: Offer, now: Date = new Date()): OfferStatus {
  if (!offer.startDateUTC || !offer.endDateUTC) return 'inactive';

  const campaignStart = new Date(offer.startDateUTC); // includes time
  const campaignEnd = new Date(offer.endDateUTC);     // includes time

  // Check full date-time first
  if (now < campaignStart) return 'upcoming';
  if (now > campaignEnd) return 'expired';

  // No repeat or daily repeat
  if (offer.repeatPatterns === 'none' || offer.repeatPatterns === 'daily') {
    // Check if current time is within the campaign start/end hours
    const startTime = campaignStart.getTime();
    const endTime = campaignEnd.getTime();
    return now.getTime() >= startTime && now.getTime() <= endTime ? 'active' : 'inactive';
  }

  // Weekly repeat
  if (offer.repeatPatterns === 'weekly') {
    const daysOfWeek = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
    const nowDay = now.getDay();
    const repeatDays = (offer.repeatDetails || []).map(d => daysOfWeek.indexOf(d.toLowerCase()));
    const isDayActive = repeatDays.includes(nowDay);

    // Also check if current time is within campaign start/end time for today
    const startTime = campaignStart.getTime();
    const endTime = campaignEnd.getTime();
    return isDayActive && now.getTime() >= startTime && now.getTime() <= endTime ? 'active' : 'inactive';
  }

  // Monthly repeat
  if (offer.repeatPatterns === 'monthly') {
    const monthsOfYear = [
      'january','february','march','april','may','june',
      'july','august','september','october','november','december'
    ];
    const nowMonth = now.getMonth();
    const repeatMonths = (offer.repeatDetails || []).map(m => monthsOfYear.indexOf(m.toLowerCase()));
    const isMonthActive = repeatMonths.includes(nowMonth);

    const startTime = campaignStart.getTime();
    const endTime = campaignEnd.getTime();
    return isMonthActive && now.getTime() >= startTime && now.getTime() <= endTime ? 'active' : 'inactive';
  }

  return 'inactive';
}



