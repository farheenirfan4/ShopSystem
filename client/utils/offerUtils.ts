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
  const campaignStart = new Date(offer.startDateUTC); // overall offer start date
  const campaignEnd = new Date(offer.endDateUTC);     // overall offer end date

  // 1. Expired if campaign is completely over
  if (now > campaignEnd) return 'expired';

  // 2. Upcoming if campaign hasn't started yet
  if (now < campaignStart) return 'upcoming';

  // 3. Extract local time components
  const nowDay = now.getDay();   // 0 = Sunday
  const nowMonth = now.getMonth(); // 0 = Jan
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  // Extract hours/minutes from offer start/end times (local)
  const startTime = new Date(offer.startDateUTC);
  const endTime = new Date(offer.endDateUTC);
  const startMinutes = startTime.getHours() * 60 + startTime.getMinutes();
  const endMinutes = endTime.getHours() * 60 + endTime.getMinutes();

  const isTimeActive = nowMinutes >= startMinutes && nowMinutes <= endMinutes;
  const repeatDetailsArray = Array.isArray(offer.repeatDetails) ? offer.repeatDetails : [];

  switch (offer.repeatPatterns) {
    case 'none':
      return isTimeActive ? 'active' : 'inactive'; // inactive if within campaign but outside time

    case 'daily':
      // No 'upcoming' here as per your requirement
      return isTimeActive ? 'active' : 'inactive';

    case 'weekly':
      const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const repeatDays = repeatDetailsArray.map(d => daysOfWeek.indexOf(d.toLowerCase()));
      if (repeatDays.includes(nowDay)) {
        return isTimeActive ? 'active' : 'inactive';
      }
      return 'upcoming';

    case 'monthly':
      const monthsOfYear = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
      const repeatMonths = repeatDetailsArray.map(m => monthsOfYear.indexOf(m.toLowerCase()));
      if (repeatMonths.includes(nowMonth)) {
        return isTimeActive ? 'active' : 'inactive';
      }
      return 'upcoming';

    default:
      return 'inactive';
  }
}

