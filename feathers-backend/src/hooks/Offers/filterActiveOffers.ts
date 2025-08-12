/*import type { HookContext } from '../../declarations';
import { getOfferStatus } from '../../utils/offerSchedule';

export const filterActiveOffers = async (context: HookContext) => {
  if (context.method === 'find' && context.params.query?.status === 'active') {
    const results = await context.result.data.filter((offer: any) => isOfferActive(offer));
    context.result.data = results;
    context.result.total = results.length;
  }
  return context;
};
*/