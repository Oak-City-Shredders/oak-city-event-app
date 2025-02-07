import { IonImg, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';

const Map: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Map</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Map</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonImg
        src="/images/lakeside-retreats-map.webp"
        alt="Lakeside Retreats map"
      />
      </IonContent>
    </IonPage>
  );
};

export default Map;
