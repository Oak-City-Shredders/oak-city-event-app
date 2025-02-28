import { useState, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import {
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonToggle,
    IonItem,
    IonLabel,
    IonIcon,
    IonCard,
} from '@ionic/react';
import useNotificationPermissions from '../hooks/useNotifcationPermissions';
import { notificationsOffOutline } from 'ionicons/icons';
import { PUSH_NOTIFICATION_TOKEN_LOCAL_STORAGE_KEY } from '../hooks/useNotifications';
import { updateTopicSubscription } from '../utils/notificationUtils';



const defaultSettings = {
    racing: true,
    scavenger_hunt: true,
    trick_comp: true,
};


const NotificationToggle: React.FC<{ topic: string }> = ({ topic }) => {

    const [notificationSettings, setNotificationsSettings] = useLocalStorage<{ [key: string]: boolean }>('notificationSettings-v2', defaultSettings);
    const { notificationPermission } = useNotificationPermissions();
    const [notificationsError, setNotificationsError] = useState('');

    // Ensure missing keys from defaults are merged in
    useEffect(() => {
        const updatedSettings = { ...defaultSettings, ...notificationSettings };
        // Only update if there were missing keys
        if (JSON.stringify(updatedSettings) !== JSON.stringify(notificationSettings)) {
            setNotificationsSettings(updatedSettings);
        }
    }, [notificationSettings, setNotificationsSettings]);

    const toggleNotification = async () => {
        const storedToken = localStorage.getItem(
            PUSH_NOTIFICATION_TOKEN_LOCAL_STORAGE_KEY
        );
        if (!storedToken) {
            setNotificationsError(
                'Notifcation settings error. Did you enable notifications?'
            );
            return;
        }

        try {
            await updateTopicSubscription(
                topic,
                storedToken,
                !notificationSettings[topic]
            );
            setNotificationsSettings((prev) => {
                notificationSettings[topic] = !notificationSettings[topic]
                return notificationSettings;
            });
            setNotificationsError('');
        } catch (error) {
            console.log(`Error updating registration for ${topic} topic`);
            setNotificationsError(
                `Error updating registration for ${topic} notifications`
            );
        }
    };

    return (
        <>
            {notificationPermission === 'prompt' ? "" : notificationPermission === 'denied' ? (
                <IonCard><IonCardContent>
                    <IonIcon icon={notificationsOffOutline} /> Go to your device's system settings and enable notifications for this app so that you can receive updates.
                </IonCardContent></IonCard>)
                :
                (
                    <IonCard>
                        <IonCardHeader>
                            <IonCardSubtitle>Enable {topic} Notifications?</IonCardSubtitle>
                        </IonCardHeader>
                        <IonCardContent>
                            <IonToggle
                                checked={notificationSettings[topic]}
                                onIonChange={() => toggleNotification()}
                            >
                                {topic} notifications
                            </IonToggle>
                            {notificationsError && (
                                <IonItem>
                                    <IonLabel color={'danger'}>
                                        {notificationsError}
                                    </IonLabel>
                                </IonItem>
                            )}
                        </IonCardContent>
                    </IonCard>
                )}</>

    );
}

export default NotificationToggle;