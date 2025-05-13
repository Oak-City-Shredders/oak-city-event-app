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
  LayersControl,
  LayerGroup,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';
import {
  LatLngExpression,
  LatLngBoundsExpression,
  LatLng,
  Icon,
  ImageOverlay as LeafletImageOverlay,
  PointExpression,
  divIcon,
  Point,
} from 'leaflet';
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';
import { IonIcon } from '@ionic/react';
import { arrowDown, arrowUp } from 'ionicons/icons';
import { renderToString } from 'react-dom/server';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { checkVibrate } from '../utils/vibrate';
import { MapLayer } from '../pages/MapPage';
import { useCurrentEvent } from '../context/CurrentEventContext';
import { getValidatedBounds } from '../utils/mapUtils';

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
  mapLayers: MapLayer[];
}

export interface POIFilter {
  type: string;
  isVisible: boolean;
}

const SetView = ({ center, zoom }: { center: LatLng; zoom: number }) => {
  console.log(`SetView ${center.lat}, ${center.lng} ${zoom}`);
  const [lastPosition, setLastPosition] = useState({
    lat: center.lat,
    lng: center.lng,
  } as LatLngExpression);
  const [lastZoom, setLastZoom] = useState(zoom);
  const map = useMap();

  useEffect(() => {
    map.attributionControl.setPrefix(false);
    map.setView(lastPosition, lastZoom);
    map.whenReady(() => {
      setLastPosition([center.lat, center.lng] as LatLngExpression);
    });
  }, [map, center, zoom]);

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
  mapLayers,
}) => {
  const centeredOnPOI = pointsOfInterest.find(
    (p) => p.name.toLowerCase() === centerOn?.toLowerCase()
  );

  const { eventInfo, loadingEventInfo } = useCurrentEvent();

  if (
    loadingEventInfo ||
    !eventInfo ||
    !eventInfo.initialLatitude ||
    !eventInfo.initialLongitude
  ) {
    console.log('EventInfo not ready. Loading event information...');
    return <div>Loading event information...</div>;
  }

  const initialLat = centeredOnPOI
    ? centeredOnPOI.lat
    : eventInfo.initialLatitude;
  const initialLng = centeredOnPOI
    ? centeredOnPOI.lng
    : eventInfo.initialLongitude;

  return (
    <>
      <SetView
        zoom={centeredOnPOI ? 20 : 17}
        center={{ lat: initialLat, lng: initialLng } as LatLng}
      />
      <LocationTracker />

      {/*
          <ResizableImageLayer
                initialBottomLeftPosition={{ lat: 35.715181, lng: -78.452050 } as LatLng}
                initialTopRightPosition={{ lat: 35.71556914275607, lng: -78.45107048749925 } as LatLng}
                imageUrl={"/images/map-icons/yurt.png"} />
      */}

      <LayersControl position="topright">
        <LayersControl.Overlay key={1} checked name="Points of Interest">
          <LayerGroup>
            {pointsOfInterest.map((poi, index) => {
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
            })}
          </LayerGroup>
        </LayersControl.Overlay>
        {mapLayers
          .filter(
            (layer) => layer.imageUrl && layer.type === 'before-tile-layer'
          )
          .map((layer) => {
            return (
              <LayersControl.Overlay key={layer.name} checked name={layer.name}>
                <ImageOverlay
                  url={layer.imageUrl}
                  bounds={layer.bounds}
                ></ImageOverlay>
              </LayersControl.Overlay>
            );
          })}

        <LayersControl.Overlay key={5} checked name="Satellite">
          <TileLayer
            maxZoom={22}
            maxNativeZoom={19}
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          />
        </LayersControl.Overlay>

        {mapLayers
          .filter(
            (layer) => layer.imageUrl && layer.type === 'after-tile-layer'
          )
          .map((layer) => {
            return (
              <LayersControl.Overlay key={layer.name} checked name={layer.name}>
                <ImageOverlay
                  pane="tilePane"
                  url={layer.imageUrl}
                  bounds={layer.bounds}
                ></ImageOverlay>
              </LayersControl.Overlay>
            );
          })}
      </LayersControl>
    </>
  );
};

const MyMap: React.FC<MyMapProps> = ({
  centerOn,
  pointsOfInterest,
  poiFilters,
  mapLayers,
}) => {
  const { eventInfo, loadingEventInfo } = useCurrentEvent();

  if (loadingEventInfo || Object.keys(eventInfo).length === 0) {
    console.log('EventInfo not ready. Loading event information...');
    return <div>Loading event information...</div>;
  }

  const maxBounds = getValidatedBounds(
    eventInfo.bottomLeftLatLng,
    eventInfo.topRightLatLng
  );

  if (!maxBounds) {
    console.error('EventInfo bounds not valid.');
    return <div>Event map information not configured.</div>;
  }

  return (
    <MapContainer
      zoomControl={false}
      maxBounds={maxBounds}
      style={{ height: '100%', width: '100vw' }}
      minZoom={16}
      maxZoom={22}
    >
      <MyMapContainer
        pointsOfInterest={pointsOfInterest}
        poiFilters={poiFilters}
        centerOn={centerOn}
        mapLayers={mapLayers}
      />
    </MapContainer>
  );
};

export default MyMap;
