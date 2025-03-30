import { IonContent, IonPage } from '@ionic/react';
import React from 'react';
import { useParams } from 'react-router-dom';
import MyMap from '../components/Map';
import { LatLngBoundsExpression } from 'leaflet';
import { POIFilter } from '../components/Map';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { IonChip, IonHeader, IonToolbar } from '@ionic/react';
import './MapPage.css';
import { useRef } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import useFireStoreDB from '../hooks/useFireStoreDB';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import ErrorBoundary from '../components/ErrorBoundary';
import { checkVibrate } from '../utils/vibrate';

interface RouteParams {
  locationName: string;
}

interface ChipToolbarProps {
  poiFilters: POIFilter[];
  error: Error | null;
  loading: boolean;
  handlePOIFilterClick: (poiFilter: POIFilter) => void;
}

const ChipToolbar: React.FC<ChipToolbarProps> = ({
  poiFilters,
  error,
  loading,
  handlePOIFilterClick,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleDrag = (event: React.MouseEvent | React.TouchEvent) => {
    if (!scrollContainerRef.current) return;

    const scrollContainer = scrollContainerRef.current;
    let startX: number;
    let scrollLeft: number;

    if ('touches' in event) {
      startX = event.touches[0].pageX - scrollContainer.offsetLeft;
    } else {
      startX = event.pageX - scrollContainer.offsetLeft;
    }

    scrollLeft = scrollContainer.scrollLeft;

    const moveHandler = (moveEvent: MouseEvent | TouchEvent) => {
      let x: number;
      if ('touches' in moveEvent) {
        x = moveEvent.touches[0].pageX - scrollContainer.offsetLeft;
      } else {
        x = moveEvent.pageX - scrollContainer.offsetLeft;
      }

      const walk = x - startX;
      scrollContainer.scrollLeft = scrollLeft - walk;
    };

    const endHandler = () => {
      document.removeEventListener('mousemove', moveHandler);
      document.removeEventListener('mouseup', endHandler);
      document.removeEventListener('touchmove', moveHandler);
      document.removeEventListener('touchend', endHandler);
    };

    document.addEventListener('mousemove', moveHandler);
    document.addEventListener('mouseup', endHandler);
    document.addEventListener('touchmove', moveHandler);
    document.addEventListener('touchend', endHandler);
  };

  return (
    <div
      className="chip-scroll-container"
      ref={scrollContainerRef}
      onMouseDown={handleDrag}
      onTouchStart={handleDrag}
    >
      {loading ? (
        <IonChip>...</IonChip>
      ) : error ? (
        <span>{error.message}</span>
      ) : (
        poiFilters.map((poiFilter, index) =>
          poiFilter.type !== 'ClickMe' && poiFilter.type !== 'Label' ? (
            <IonChip
              onClick={() => handlePOIFilterClick(poiFilter)}
              outline={!poiFilter.isVisible}
              key={index}
              className="chip"
            >
              {poiFilter.type}
            </IonChip>
          ) : null
        )
      )}
    </div>
  );
};

interface FireDBMapItems {
  Description: string;
  Icon: string;
  'Icon Anchor': string;
  'Icon Popup Anchor': string;
  'Icon size': string;
  Image: string;
  'Image Left Bottom': string;
  'Image Top Right': string;
  Lat: string;
  Lng: string;
  'Marker or Image': string;
  Name: string;
  'Tooltip Offset': string;
  Type: string;
  route: string;
  id: string;
}

const MapPage: React.FC = () => {
  console.log('MapPage');
  const { locationName } = useParams<RouteParams>();
  const [poiFilters, setPOIFilters] = useState([] as POIFilter[]);

  const SHEET_ID = import.meta.env
    .VITE_REACT_APP_GOOGLE_SHEET_RACING_INFO_ID as string;
  const RANGE = 'MapData!A:P'; // Adjust range based on racer data (e.g., A:C for 3 columns)

  const { data, loading, error, refetch } =
    useFireStoreDB<FireDBMapItems>('MapData');
  const [localPOIFilters, setLocalPOIFilters] = useLocalStorage<POIFilter[]>(
    'poi-filters-v1',
    []
  );
  const pointsOfInterest = useMemo(() => {
    if (!data) return [];
    console.log('pointsOfInterest');
    return data.slice(1).map((item) => ({
      id: Number(item.id),
      lat: Number(item.Lat),
      lng: Number(item.Lng),
      type: item.Type,
      name: item.Name,
      icon: item.Icon,
      description: item.Description,
      image: item.Image,
      route: item.route,
      iconSize: item['Icon size']
        ? item['Icon size'].split(',').map(Number)
        : [24, 24],
      iconAnchor: item['Icon Anchor']
        ? item['Icon Anchor'].split(',').map(Number)
        : [12, 12],
      popupAnchor: item['Icon Popup Anchor']
        ? item['Icon Popup Anchor'].split(',').map(Number)
        : [1, -34],
      isImage: item['Marker or Image'] === 'Image',
      bounds:
        item['Image Left Bottom'] && item['Image Top Right']
          ? ([
              [
                Number(item['Image Left Bottom'].split(',')[0]),
                Number(item['Image Left Bottom'].split(',')[1]),
              ],
              [
                Number(item['Image Top Right'].split(',')[0]),
                Number(item['Image Top Right'].split(',')[1]),
              ],
            ] as LatLngBoundsExpression)
          : undefined,
      toolTipOffset: item['Tooltip Offset']
        ? item['Tooltip Offset'].split(',').map(Number)
        : [0, -20],
      isVisible: true,
    }));
  }, [data]); // ✅ Only recomputes when `data` changes

  useEffect(() => {
    const poiFilters = [
      ...new Set(pointsOfInterest.map((poi) => poi.type)),
    ].map((t) => ({
      type: t,
      isVisible: localPOIFilters.find((f) => f.type === t)?.isVisible ?? false,
    }));
    setPOIFilters(poiFilters);
  }, [pointsOfInterest]); // ✅ Only runs when `pointsOfInterest` changes

  const handlePOIFilterClick = useCallback(
    async (poiFilter: POIFilter) => {
      console.log('handlePOIFilterClick', poiFilter);

      checkVibrate(
        async () => await Haptics.impact({ style: ImpactStyle.Medium })
      );
      setPOIFilters((prev) => {
        const poiFilters = prev.map((f) =>
          f.type === poiFilter.type ? { ...f, isVisible: !f.isVisible } : f
        );
        setLocalPOIFilters(() => poiFilters);
        return poiFilters;
      });
    },
    [poiFilters]
  );

  const position = {
    lat: 35.7211377702728,
    lng: -78.453566696167,
  };

  return (
    <ErrorBoundary>
      <IonPage>
        <IonHeader>
          <IonToolbar color={'primary'}>
            <ChipToolbar
              poiFilters={poiFilters}
              loading={loading}
              error={error}
              handlePOIFilterClick={handlePOIFilterClick}
            />
          </IonToolbar>
        </IonHeader>
        <IonContent style={{ height: '200px', width: '100vw' }}>
          <MyMap
            centerOn={locationName}
            poiFilters={poiFilters}
            pointsOfInterest={pointsOfInterest}
          />
        </IonContent>
      </IonPage>
    </ErrorBoundary>
  );
};

export default MapPage;
