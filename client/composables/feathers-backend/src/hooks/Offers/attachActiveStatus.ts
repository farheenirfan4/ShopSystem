// src/hooks/attach-offer-status.ts
import type { HookContext } from '../../declarations';
import { getOfferStatus } from '../../utils/offerSchedule';

export const attachOfferStatus = async (context: HookContext) => {
  const nowUTC = new Date();

  const addStatus = (offer: any) => ({
    ...offer,
    status: getOfferStatus(offer, nowUTC)
  });

  if (context.method === 'find' && Array.isArray(context.result.data)) {
    context.result.data = context.result.data.map(addStatus);
  } else if (context.method === 'get' && context.result) {
    context.result = addStatus(context.result);
  }

  return context;
};
