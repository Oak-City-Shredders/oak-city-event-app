import { RefresherEventDetail } from '@ionic/react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { checkVibrate } from '../utils/vibrate';

export const useRefreshHandler = (refetch: () => Promise<void>) => {
  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    checkVibrate(
      async () => await Haptics.impact({ style: ImpactStyle.Medium })
    );

    await refetch(); // Call the provided refetch function
    event.detail.complete(); // Notify Ionic that the refresh is complete
  };

  return handleRefresh;
};

export const useRefreshHandlers = (
  refetchCallbacks: Array<() => Promise<void>>
) => {
  const handleRefresh = async (event: CustomEvent<RefresherEventDetail>) => {
    checkVibrate(
      async () => await Haptics.impact({ style: ImpactStyle.Medium })
    );

    // Execute all refetch callbacks in parallel
    await Promise.all(refetchCallbacks.map((refetch) => refetch()));

    event.detail.complete(); // Notify Ionic that the refresh is complete
  };

  return handleRefresh;
};
