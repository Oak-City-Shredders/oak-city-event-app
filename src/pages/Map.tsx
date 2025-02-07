import { 
  IonImg,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonBadge,
  IonIcon } from '@ionic/react';
import { locationOutline } from 'ionicons/icons';
import React, { useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

 interface LocationItem {
  id: number;
  name: string;
  x: number;
  y: number;
}

interface RouteParams {
  locationName: string;
}

const Map: React.FC = () => {

  const { locationName } = useParams<RouteParams>(); // Get the location name from the URL

  const locations = [
    { id: 1, name: 'StOak Park', x: 230, y: 680 },
    { id: 2, name: 'Float Track', x: 600, y: 550 },
    { id: 3, name: 'Water Station', x: 230, y: 620 },
    { id: 4, name: 'Lakeside Stage', x: 340, y: 350 },
    { id: 5, name: 'Front Gate', x: 150, y: 975 },
    { id: 5, name: 'Qualifier', x: 450, y: 675 },
  ];

  const selectedLocation = locations.find(loc => loc.name === decodeURIComponent(locationName));
  const mapImageRef = useRef<HTMLIonImgElement | null>(null);
  const [mapWidth, setMapWidth] = useState(0);
  const [mapHeight, setMapHeight] = useState(0);

  const handleImageLoad = () => {
    if (mapImageRef.current) {
      const imgElement = mapImageRef.current.shadowRoot?.querySelector('img');
      if (imgElement) {
        setMapWidth(imgElement.offsetWidth);
        setMapHeight(imgElement.offsetHeight);
      }
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Map</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonImg
        onIonImgDidLoad={handleImageLoad}
        ref={mapImageRef}
        src="/images/lakeside-retreats-map.webp"
        alt="Lakeside Retreats map"
      />
        {selectedLocation && <div
          key={selectedLocation.id}
          style={{
            position: 'absolute',
            top: `${(selectedLocation.y / 1000) * mapHeight}px`,  // Scale Y coordinate
            left: `${(selectedLocation.x / 1000) * mapWidth}px`, // Scale X coordinate
            backgroundColor: 'blue',
            borderRadius: '50%',
            width: '10px',
            height: '10px',
          }}
        >
          <IonBadge
            color="primary"
          >
            <IonIcon icon={locationOutline}  /> {selectedLocation.name}
          </IonBadge>
        </div>}
      </IonContent>
    </IonPage>
  );
};

export default Map;
