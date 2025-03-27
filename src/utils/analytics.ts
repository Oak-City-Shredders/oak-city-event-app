import { FirebaseAnalytics } from '@capacitor-firebase/analytics';

// Define a type for event parameters (customize as needed)
interface AnalyticsParams {
  [key: string]: string | number | boolean | undefined;
}

export const logEvent = async (
  eventName: string,
  params: AnalyticsParams = {}
) => {
  try {
    await FirebaseAnalytics.logEvent({
      name: eventName,
      params,
    });
  } catch (error) {
    console.error(`Failed to log event ${eventName}:`, error);
  }
};
