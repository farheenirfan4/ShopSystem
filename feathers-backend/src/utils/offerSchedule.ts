// src/utils/offer-schedule.ts
import { Offers } from '../services/offers/offers.schema';

export type OfferStatus = 'upcoming' | 'active' | 'expired';

export function getOfferStatus(offer: Offers, now: Date = new Date()): OfferStatus {
  const start = new Date(offer.startDateUTC);
  const end = new Date(offer.endDateUTC);

  // 1. Check for overall date validity first for ALL offer types.
  // This part remains the same, as the overall start/end dates are UTC.
  if (now < start) {
    return 'upcoming';
  }
  if (now > end) {
    return 'expired';
  }

  // 2. Handle non-repeating offers.
  if (offer.repeatPatterns === 'none') {
    return 'active';
  }

  // 3. Handle repeating offers based on pattern and LOCAL time.
  
  // Use local time for comparison.
  const nowDay = now.toLocaleString('en-US', { weekday: 'long' })
  .toLowerCase() as | 'monday'
    | 'tuesday'
    | 'wednesday'
    | 'thursday'
    | 'friday'
    | 'saturday'
    | 'sunday';
  const nowMonth = now.toLocaleString('en-US', { month: 'long' })
  .toLowerCase()  as | 'january' 
    | 'february'
    | 'march'
    |'april'
    |'may'
    |'june'
    |'july'
    |'august'
    |'september'
    |'october'
    | 'november'
 | 'december';

  // Use getHours() and getMinutes() for LOCAL time.
  const nowTime = now.getHours() * 60 + now.getMinutes();

  // Extract start and end times from the UTC dates, but assume they
  // represent local time for the offer's time window.
  const startTime = start.getHours() * 60 + start.getMinutes();
  const endTime = end.getHours() * 60 + end.getMinutes();

  const repeatDetailsArray = Array.isArray(offer.repeatDetails) ? offer.repeatDetails : [];

  switch (offer.repeatPatterns) {
    case 'daily':
      if (nowTime >= startTime && nowTime <= endTime) {
        return 'active';
      }
      return 'upcoming';

    case 'weekly':
      if (repeatDetailsArray.includes(nowDay)) {
        if (nowTime >= startTime && nowTime <= endTime) {
          return 'active';
        }
        return 'upcoming';
      }
      return 'upcoming';
      
    case 'monthly':
      if (repeatDetailsArray.includes(nowMonth)) {
        if (nowTime >= startTime && nowTime <= endTime) {
          return 'active';
        }
        return 'upcoming';
      }
      return 'upcoming';
  }

  return 'upcoming';
}