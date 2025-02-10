import {
  IonImg,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonBadge,
  IonIcon
} from '@ionic/react';
import { locationOutline } from 'ionicons/icons';
import React, { useRef, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { TransformWrapper, TransformComponent, useTransformEffect, ReactZoomPanPinchState } from 'react-zoom-pan-pinch';

interface LocationItem {
  id: number;
  name: string;
  x: number;
  y: number;
}

interface RouteParams {
  locationName: string;
}

const ZoomableContent = ({ updateState }: { updateState: (state: ReactZoomPanPinchState) => void }) => {
  useTransformEffect(({ state, instance }) => {
    console.log(state); // { previousScale: 1, scale: 1, positionX: 0, positionY: 0 }
    updateState(state);
    return () => {
      // unmount
    };
  });

  return (
    <div style={{ height: window.innerHeight }}>
      <IonImg
        src="/images/lakeside-retreats-map.webp"
        alt="Lakeside Retreats map"
      />
    </div>
  );
};

const Map: React.FC = () => {
  const { locationName } = useParams<RouteParams>();
  const locations: LocationItem[] = [
    { id: 1, name: 'StOak Park', x: 200, y: 550 },
    { id: 2, name: 'Float Track', x: 500, y: 450 },
    { id: 3, name: 'Water Station', x: 230, y: 620 },
    { id: 4, name: 'Lakeside Stage', x: 310, y: 250 },
    { id: 5, name: 'Front Gate', x: 150, y: 975 },
    { id: 6, name: 'Qualifier', x: 405, y: 485 },
  ];

  const selectedLocation = locations .find(loc => loc.name === decodeURIComponent(locationName));

  const updateTransformState = useCallback((state: ReactZoomPanPinchState) => {
    if (selectedLocation){
      const clientWidth = (ionContentRef.current) ? ionContentRef.current.offsetWidth : 1000;
      const clientHeight = (ionContentRef.current) ? ionContentRef.current.offsetWidth : 1000;
      const adjustedX = Math.floor((clientWidth * selectedLocation.x) / 1000);
      const adjustedY = Math.floor((clientHeight * selectedLocation.y) / 1000);

      setLabelTransform((prev) => ({ x: ((adjustedX * state.scale) + (state.positionX)), y: ((adjustedY * state.scale) + (state.positionY)), scale: prev.scale }))
    }
  }, []);

  const ionContentRef = useRef<HTMLIonContentElement | null>(null);
  
  type LabelTransform = { x: number; y: number, scale: number };
  const [labelTransform, setLabelTransform] = useState<LabelTransform>({ x: 0, y: 0, scale: 1 });

  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Map</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen ref={ionContentRef}>
        <div style={{ position: 'relative' }}>
          { selectedLocation &&  (<IonBadge style={{
            position: 'absolute', top: `${labelTransform.y}px`,
            left: `${labelTransform.x}px`, zIndex: 10
          }} color="primary">
            <IonIcon icon={locationOutline} />{selectedLocation.name}
          </IonBadge>)}

          <TransformWrapper minPositionY={Math.floor(400 * labelTransform.scale)}>
            <TransformComponent >
              <ZoomableContent updateState={updateTransformState} />
            </TransformComponent>
          </TransformWrapper>
        </div>

      </IonContent>
    </IonPage>
  );
};

export default Map;
