import { HttpResponse } from '@capacitor/core';
import { CapacitorHttp } from '@capacitor/core';

const SUBSCRIBE_TOPIC_URL =
    'https://register-push-notification-604117514059.us-central1.run.app';
const UNSUBSCRIBE_TOPIC_URL =
    'https://unregister-push-notification-604117514059.us-central1.run.app';

export async function updateTopicSubscription(
    topic: string,
    token: string,
    enable: boolean
) {
    const url = enable ? SUBSCRIBE_TOPIC_URL : UNSUBSCRIBE_TOPIC_URL;
    console.log('fetching:', url);
    try {
        const options = {
            url: url,
            headers: { 'Content-Type': 'application/json' },
            data: { token: token, topic },
        };

        const response: HttpResponse = await CapacitorHttp.post(options);
        console.log('Response:', response);

        if (
            !response.status ||
            response.status < 200 ||
            response.status >= 300
        ) {
            throw new Error(
                `Failed to update token subscription. Status: ${response.status}`
            );
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}
