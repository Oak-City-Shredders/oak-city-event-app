import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
  ImageOverlay,
  Tooltip,
  CircleMarker,
  SVGOverlay,
  LayersControl,
  LayerGroup,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';
import {
  LatLngBounds,
  LatLngExpression,
  LatLngBoundsExpression,
  LatLng,
  Icon,
  ImageOverlay as LeafletImageOverlay,
  PointExpression,
  map,
  divIcon,
  Point,
} from 'leaflet';
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';
import { IonIcon } from '@ionic/react';
import { arrowDown, arrowUp } from 'ionicons/icons';
import { renderToString } from 'react-dom/server';
import { Rectangle } from 'react-leaflet';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { checkVibrate } from '../utils/vibrate';

const mapRoadAndTrailImageUrl = '/images/map/2024map-roads.webp'; // replace with new map when available
const mapGraphicsUrl = '/images/map/2024map-graphics-cleaned.webp'; // replace with new map when available
const mapBackgroundUrl = '/images/map/background.webp'; // replace with new map when available
// Explicitly define the marker icon
const customIcon = new Icon({
  iconUrl: '/images/icon-48.webp', // Path to marker icon
  iconSize: [24, 24], // Width and height
  iconAnchor: [12, 12], // Point where the marker should be anchored
  popupAnchor: [1, -34], // Where the popup should appear
  //shadowUrl: "/leaflet/marker-shadow.png",
  //shadowSize: [41, 41],
});

const LocationTracker: React.FC = () => {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  // Custom CSS for pulsing effect
  const pulsingIcon = divIcon({
    className: 'pulsing-icon',
    html: `<img class="location-image" src="/images/icon-48.webp" alt="Your location squirrel"> <div class="pulse-background"></div>`,
    iconSize: [40, 40], // The size of the visible circle
    iconAnchor: [10, 10], // Center the icon
  });

  // Function to request permission and get the location
  const getLocation = async () => {
    try {
      // Check permission status
      const permStatus = await Geolocation.checkPermissions();
      console.log('Permission status:', permStatus);
      if (permStatus.location === 'denied') {
        setError('Location permission denied. Enable it in settings.');
        return;
      }

      if (
        permStatus.location === 'prompt' &&
        Capacitor.getPlatform() !== 'web'
      ) {
        const request = await Geolocation.requestPermissions();
        if (request.location === 'denied') {
          setError('User denied location access.');
          return;
        }
      }

      // Watch location updates
      const watchId = await Geolocation.watchPosition(
        { enableHighAccuracy: true },
        (pos, err) => {
          if (err) {
            setError(err.message);
            return;
          }
          if (pos) {
            console.log('Position updated:', pos);
            setPosition({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            });
          }
        }
      );

      // Get current position
      const coordinates = await Geolocation.getCurrentPosition();
      console.log('Current position:', coordinates);
      setPosition({
        lat: coordinates.coords.latitude,
        lng: coordinates.coords.longitude,
      });

      return () => Geolocation.clearWatch({ id: watchId }); // Cleanup on unmount
    } catch (err) {
      setError('Failed to get location.');
      console.error('Error getting location:', err);
    }
  };

  useEffect(() => {
    getLocation(); // Automatically fetch location when component mounts
  }, []);

  return position ? (
    <Marker
      icon={pulsingIcon}
      key={13}
      position={position}
      interactive={false}
    />
  ) : (
    <div
      style={{
        position: 'absolute',
        zIndex: 1001,
        top: 100,
        left: 10,
        border: 1,
        borderColor: 'red',
        background: 'red',
      }}
    >
      {error}
    </div>
  );
};

// Define the bounds for the image
const imageBounds: LatLngBoundsExpression = [
  [35.713897, -78.456665], // bottom-left corner
  [35.721622, -78.449455], // top-right corner
];

interface ImageOverlayWithOpacityProps {
  bottomLeftPosition: LatLng;
  topRightPosition: LatLng;
  imageUrl: string;
}

const ImageOverlayWithOpacity = ({
  imageUrl,
  bottomLeftPosition,
  topRightPosition,
}: {
  imageUrl: string;
  bottomLeftPosition: LatLng;
  topRightPosition: LatLng;
}) => {
  const [opacity, setOpacity] = useState(1); // Adjust initial transparency
  const overlayRef = useRef<LeafletImageOverlay | null>(null);

  const newBounds: LatLngBoundsExpression = [
    [bottomLeftPosition.lat, bottomLeftPosition.lng], // top-right corner
    [topRightPosition.lat, topRightPosition.lng], // bottom-left corner,
  ];

  return (
    <>
      {/*
            <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                style={{ position: "absolute", zIndex: 1000, top: 10, left: 10 }}
            />

 */}
      <ImageOverlay
        url={imageUrl}
        ref={overlayRef}
        bounds={newBounds}
        opacity={opacity}
        interactive={true}
      ></ImageOverlay>
    </>
  );
};

const LocationMarker: React.FC = () => {
  const [position, setPosition] = useState<LatLngExpression | null>(null);
  const [initialPosition, setInitialPosition] = useState<LatLngExpression>([
    0, 0,
  ]);
  const [selectedPosition, setSelectedPosition] = useState<LatLngExpression>([
    0, 0,
  ]);

  const map = useMap();
  console.log(`map zoom: ${map.getZoom()}`);

  const mapEvent = useMapEvents({
    click(e) {
      console.log('click', e.latlng);
      console.log(e);
      setSelectedPosition([e.latlng.lat, e.latlng.lng] as LatLngExpression);
    },
    locationfound(e) {
      setSelectedPosition(e.latlng);
      mapEvent.flyTo(e.latlng, mapEvent.getZoom());
    },
  });

  /* return position === null ? null : (
         <Marker position={position}>
             <Popup>You are here</Popup>
         </Marker>
     );*/

  return position ? (
    <Marker key={12} position={selectedPosition} interactive={false} />
  ) : null;
};

const initialLeftBottomPosition = {
  lat: 35.713547074031176,
  lng: -78.45827221870424,
};

const initialTopRightPosition = {
  lat: 35.722144594714386,
  lng: -78.44730734825136,
};

// Define the bounds for the image and max bounds
const bounds: LatLngBoundsExpression = [
  [initialLeftBottomPosition.lat, initialLeftBottomPosition.lng], // top-right corner
  [initialTopRightPosition.lat, initialTopRightPosition.lng], // bottom-left corner,
];

const bgLeftBottomPosition = {
  lat: 35.613547074031176,
  lng: -78.46827221870424,
};

const bgTopRightPosition = {
  lat: 35.752144594714386,
  lng: -78.43730734825136,
};

// Define the bounds for the image and max bounds
const bgBounds: LatLngBoundsExpression = [
  [bgLeftBottomPosition.lat, bgLeftBottomPosition.lng], // top-right corner
  [bgTopRightPosition.lat, bgTopRightPosition.lng], // bottom-left corner,
];

const ResizableImageLayer = ({
  initialBottomLeftPosition,
  initialTopRightPosition,
  imageUrl,
}: {
  initialBottomLeftPosition: LatLng;
  initialTopRightPosition: LatLng;
  imageUrl: string;
}) => {
  const [draggable, setDraggable] = useState(false);
  const [bottomLeftPosition, setBottomLeftPosition] = useState(
    initialBottomLeftPosition
  );
  const [topRightPosition, setTopRightPosition] = useState(
    initialTopRightPosition
  );

  const markerRef = useRef<L.Marker | null>(null);
  const topRightMarkerRef = useRef<L.Marker | null>(null);

  const eventHandlersBottomLeft = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          setBottomLeftPosition(marker.getLatLng());
        }
      },
    }),
    []
  );

  const eventHandlersTopRight = useMemo(
    () => ({
      dragend() {
        const marker = topRightMarkerRef.current;
        if (marker != null) {
          setTopRightPosition(marker.getLatLng());
        }
      },
    }),
    []
  );
  const toggleDraggable = useCallback(() => {
    setDraggable((d) => !d);
  }, []);

  return (
    <>
      <Marker
        draggable={draggable}
        eventHandlers={eventHandlersTopRight}
        position={topRightPosition}
        ref={topRightMarkerRef}
      >
        <Popup minWidth={90}>
          <span onClick={toggleDraggable}>
            {draggable
              ? `Marker is draggable ${topRightPosition.lat}, ${topRightPosition.lng}`
              : `Click here to make marker draggable  ${topRightPosition.lat}, ${topRightPosition.lng}`}
          </span>
        </Popup>
      </Marker>
      <Marker
        draggable={draggable}
        eventHandlers={eventHandlersBottomLeft}
        position={bottomLeftPosition}
        ref={markerRef}
      >
        <ImageOverlayWithOpacity
          bottomLeftPosition={bottomLeftPosition as LatLng}
          topRightPosition={topRightPosition as LatLng}
          imageUrl={imageUrl}
        />
        <Popup minWidth={90}>
          <span onClick={toggleDraggable}>
            {draggable
              ? `Marker is draggable ${bottomLeftPosition.lat}, ${bottomLeftPosition.lng}`
              : `Click here to make marker draggable  ${bottomLeftPosition.lat}, ${bottomLeftPosition.lng}`}
          </span>
        </Popup>
      </Marker>
    </>
  );
};

const DraggableMarker = ({ initialPosition }: { initialPosition: LatLng }) => {
  const [draggable, setDraggable] = useState(false);
  const [position, setPosition] = useState(initialPosition);

  const markerRef = useRef<L.Marker | null>(null);

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          console.log('dragend', marker.getLatLng());
          setPosition(marker.getLatLng());
        }
      },
    }),
    []
  );

  const toggleDraggable = useCallback(() => {
    setDraggable((d) => !d);
  }, []);

  return (
    <Marker
      icon={customIcon}
      key={211}
      draggable={draggable}
      eventHandlers={eventHandlers}
      position={position}
      ref={markerRef}
    >
      <Popup minWidth={90}>
        <span onClick={toggleDraggable}>
          {draggable
            ? `Marker is draggable ${position.lat}, ${position.lng}`
            : `Click here to make marker draggable  ${position.lat}, ${position.lng}`}
        </span>
      </Popup>
    </Marker>
  );
};

const TooltipMarker = ({
  index,
  poi,
  filter,
}: {
  index: number;
  poi: PointOfInterest;
  filter: POIFilter | undefined;
}) => {
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const handleClick = async () => {
    checkVibrate(
      async () => await Haptics.impact({ style: ImpactStyle.Light })
    );
    setTooltipVisible(!tooltipVisible);
  };

  const position = {
    lat: poi.lat,
    lng: poi.lng,
  };

  const poiIcon = poi.icon
    ? new Icon({
        iconUrl: poi.iconUrl ? poi.iconUrl : `/images/map-icons/${poi.icon}`,
        iconSize: poi.iconSize ? (poi.iconSize as PointExpression) : [24, 24],
        iconAnchor: poi.iconAnchor
          ? (poi.iconAnchor as PointExpression)
          : [12, 12],
        popupAnchor: poi.popupAnchor
          ? (poi.popupAnchor as PointExpression)
          : [1, -34],
      })
    : customIcon;

  if (poi.isImage) {
    if (!poi.bounds) {
      console.error('POI isImage but no bounds provided');
      return null;
    }

    return (
      <ImageOverlay
        pane="shadowPane"
        interactive={true}
        url={poi.iconUrl ? poi.iconUrl : `/images/map-icons/${poi.icon}`}
        bounds={poi.bounds as LatLngBoundsExpression}
        eventHandlers={{ click: handleClick }}
      >
        {tooltipVisible || filter?.isVisible ? (
          <Tooltip permanent={true} direction="top" offset={[0, -20]}>
            <span>{poi.name}</span>
          </Tooltip>
        ) : null}
      </ImageOverlay>
    );
  }

  if (poi.type === 'Label') {
    const labelIcon =
      poi.icon === 'arrowUp'
        ? arrowUp
        : poi.icon === 'arrowDown'
        ? arrowDown
        : undefined;
    //console.log("labelIcon:", labelIcon)
    const customDivIcon = labelIcon
      ? divIcon({
          html: renderToString(<IonIcon icon={labelIcon} size="large" />),
          className: 'xshow-icon',
          iconSize: new Point(10, 10),
        })
      : divIcon({
          html: renderToString(<div />),
          className: 'xshow-icon',
          iconSize: new Point(1, 1),
        });

    return (
      <Marker key={index} icon={customDivIcon} position={position as LatLng}>
        <Tooltip
          offset={[0, 10]}
          permanent
          direction={'bottom'}
          className={'my-labels'}
        >
          <span className={'bold-outline-text'}>{poi.name}</span>
        </Tooltip>
      </Marker>
    );
  }

  return (
    <>
      <Marker key={index} icon={poiIcon} position={position as LatLng}>
        {filter?.isVisible ? (
          <Tooltip
            permanent
            position={position}
            direction="top"
            offset={[0, -20]}
          >
            <span>{poi.name}</span>
          </Tooltip>
        ) : null}
      </Marker>
    </>
  );
};

export interface PointOfInterest {
  id: number;
  lat: number;
  lng: number;
  type: string;
  name: string;
  icon: string;
  iconUrl: string; // Optional URL for custom icon
  iconSize: number[];
  iconAnchor: number[];
  popupAnchor: number[];
  description: string;
  image: string;
  route: string;
  isVisible: boolean;
  isImage?: boolean;
  bounds?: LatLngBoundsExpression;
}

interface MyMapProps {
  centerOn?: string;
  pointsOfInterest: PointOfInterest[];
  poiFilters: POIFilter[];
}

export interface POIFilter {
  type: string;
  isVisible: boolean;
}

const SetView = ({ center }: { center: LatLng }) => {
  console.log('SetView');
  const [lastPosition, setLastPosition] = useState({
    lat: center.lat,
    lng: center.lng,
  } as LatLngExpression);
  const [lastZoom, setLastZoom] = useState(17);
  const map = useMap();
  useEffect(() => {
    map.attributionControl.setPrefix(false);
    map.setView(lastPosition, lastZoom);
    map.whenReady(() => {
      console.log('ready');
      setLastPosition([center.lat, center.lng] as LatLngExpression);
    });
  }, [map, center]);

  const mapEvent = useMapEvents({
    click(e) {
      console.log('click', e.latlng);
      console.log(e);
      mapEvent.flyTo(e.latlng, mapEvent.getZoom());
    },
    zoomend(e) {
      console.log('zoomend', e.target.getZoom());
      e.target.getZoom() !== lastZoom && setLastZoom(e.target.getZoom());
      //setLastPosition(e.target.getCenter() as LatLngExpression);
    },
    moveend(e) {
      console.log('moveend', e.target.getCenter());
      e.target.getCenter() !== lastPosition &&
        setLastPosition(e.target.getCenter() as LatLngExpression);
    },
    movestart(e) {
      console.log('move start');
    },
  });

  setTimeout(function () {
    console.log('map size invalidated');
    map.invalidateSize();
  }, 0);
  return null;
};

const MyMapContainer: React.FC<MyMapProps> = ({
  centerOn,
  pointsOfInterest,
  poiFilters,
}) => {
  console.log('MyMapContainer Rendered: ', centerOn);

  const centeredOnPOI = pointsOfInterest.find(
    (p) => p.name.toLowerCase() === centerOn?.toLowerCase()
  );

  console.log(`centered on '${JSON.stringify(centeredOnPOI)}' `);

  const initialLat = centeredOnPOI ? centeredOnPOI.lat : 35.717140528123075;
  const initialLng = centeredOnPOI ? centeredOnPOI.lng : -78.45191998873842;

  console.log('initialLat', initialLat);
  console.log('initialLng', initialLng);

  return (
    <>
      <SetView center={{ lat: initialLat, lng: initialLng } as LatLng} />
      <LocationTracker />

      {/*

           <ChangeView coords={startPos as LatLngExpression} />
           
                        <LocationMarker />
                        <DraggableMarker initialPosition={position as LatLng} />

                        <ResizableImageLayer
                initialBottomLeftPosition={{ lat: 35.715181, lng: -78.452050 } as LatLng}
                initialTopRightPosition={{ lat: 35.71556914275607, lng: -78.45107048749925 } as LatLng}
                imageUrl={"/images/map-icons/yurt.png"} />

                     */}

      <LayersControl position="topright">
        <LayersControl.Overlay key={1} checked name="Points of Interest">
          <LayerGroup>
            {pointsOfInterest.map((poi, index) => {
              //const filter = poiFilters.find(poiFilter => poiFilter.type === poi.type && poiFilter.isVisible);
              //return filter ? ( // Explicit return statement
              return (
                <TooltipMarker
                  key={index}
                  index={index}
                  poi={poi}
                  filter={poiFilters.find(
                    (poiFilter) => poiFilter.type === poi.type
                  )}
                />
              );
              // )
              //: null; // Return `null` for items that shouldn't render
            })}
          </LayerGroup>
        </LayersControl.Overlay>

        <LayersControl.Overlay key={3} checked name="Roads and Trails">
          <ImageOverlay
            url={mapRoadAndTrailImageUrl}
            bounds={bounds}
          ></ImageOverlay>
        </LayersControl.Overlay>

        <LayersControl.Overlay key={4} checked name="Graphics">
          <ImageOverlay url={mapGraphicsUrl} bounds={bounds}></ImageOverlay>
        </LayersControl.Overlay>

        <LayersControl.Overlay key={5} checked name="Satellite">
          <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
        </LayersControl.Overlay>

        <LayersControl.Overlay key={6} checked name="Background">
          <ImageOverlay
            pane="tilePane"
            url={mapBackgroundUrl}
            bounds={bgBounds}
          ></ImageOverlay>
        </LayersControl.Overlay>
      </LayersControl>
    </>
  );
};

const MyMap: React.FC<MyMapProps> = ({
  centerOn,
  pointsOfInterest,
  poiFilters,
}) => {
  const maxBounds: LatLngBoundsExpression = [
    [35.72376469229937, -78.4452795982361], // top-right corner
    [35.712057439695535, -78.46047163009645], // bottom-left corner,
  ];

  const GoogleFormURL =
    'https://docs.google.com/forms/d/e/1FAIpQLScBCIPfAtLoJyPb3rFQPGkf3Vh3TVm5AbqfK-GIn34ziceJMw/viewform?usp=pp_url';

  const [longPressCoords, setLongPressCoords] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Custom Map Event Handler for Long Press
  const LongPressHandler = () => {
    const map = useMapEvents({
      mousedown: (e) => {
        console.log('mouse down');
        timerRef.current = setTimeout(() => {
          setLongPressCoords(e.latlng);
          handleLongPress(e.latlng.lat, e.latlng.lng);
        }, 800); // Long press threshold (800ms)
      },
      mouseup: () => clearTimeout(timerRef.current!),
    });

    return null;
  };
  // Handle Long Press Action
  const handleLongPress = (lat: number, lng: number) => {
    const isConfirmed = window.confirm(
      `Submit location?\nLatitude: ${lat}\nLongitude: ${lng}`
    );
    if (isConfirmed) {
      const formURL = `${GoogleFormURL}&entry.1980346688=${lat}&entry.610497468=${lng}`;
      window.open(formURL, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <MapContainer
      zoomControl={false}
      maxBounds={maxBounds}
      style={{ height: '100%', width: '100vw' }}
      minZoom={16}
      maxZoom={20}
    >
      <MyMapContainer
        pointsOfInterest={pointsOfInterest}
        poiFilters={poiFilters}
        centerOn={centerOn}
      />
      <LongPressHandler />
      {/* 
            <Rectangle bounds={maxBounds} pathOptions={{ color: 'black' }}></Rectangle>
            */}
      {/*
                    35.715181°N 78.452050°W
                    35.715339°N 78.452316°W
                    //35.715427, -78.452182
                    
                    // 35.71534156730891, -78.4513668715954
                    //35.71556914275607, -78.45107048749925
                    {/* 
                    <TileLayer
                        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    />
                    */}
    </MapContainer>
  );
};

export default MyMap;
