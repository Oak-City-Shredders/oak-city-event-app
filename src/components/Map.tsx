import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, ImageOverlay } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { LatLngExpression, LatLngBoundsExpression, LatLng, Icon, ImageOverlay as LeafletImageOverlay } from "leaflet";
import { Geolocation } from "@capacitor/geolocation";
import { Capacitor } from "@capacitor/core";
import useGoogleSheets from "../hooks/useGoogleSheets";
import { IonChip, IonToolbar } from "@ionic/react";

const mapImageUrl = "/images/2024map-180rotate.webp"; // replace with new map when available

// Explicitly define the marker icon
const customIcon = new Icon({
    iconUrl: "/images/icon-48.webp",  // Path to marker icon
    iconSize: [24, 24], // Width and height
    iconAnchor: [12, 12], // Point where the marker should be anchored
    popupAnchor: [1, -34], // Where the popup should appear
    //shadowUrl: "/leaflet/marker-shadow.png",
    shadowSize: [41, 41],
});

const LocationTracker: React.FC = () => {
    const [position, setPosition] = useState<{ lat: number; lng: number } | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Function to request permission and get the location
    const getLocation = async () => {
        try {
            // Check permission status
            const permStatus = await Geolocation.checkPermissions();
            console.log("Permission status:", permStatus);
            if (permStatus.location === "denied") {
                setError("Location permission denied. Enable it in settings.");
                return;
            }

            if (permStatus.location === "prompt" && Capacitor.getPlatform() !== 'web') {
                const request = await Geolocation.requestPermissions();
                if (request.location === "denied") {
                    setError("User denied location access.");
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
                        console.log("Position updated:", pos);
                        setPosition({
                            lat: pos.coords.latitude,
                            lng: pos.coords.longitude,
                        });
                    }
                }
            );

            // Get current position
            const coordinates = await Geolocation.getCurrentPosition();
            console.log("Current position:", coordinates);
            setPosition({
                lat: coordinates.coords.latitude,
                lng: coordinates.coords.longitude,
            });

            return () => Geolocation.clearWatch({ id: watchId }); // Cleanup on unmount
        } catch (err) {
            setError("Failed to get location.");
            console.error("Error getting location:", err);
        }
    };

    useEffect(() => {
        getLocation(); // Automatically fetch location when component mounts

    }, []);

    return (
        position ?
            <Marker
                icon={customIcon}
                key={13}
                position={position}
                interactive={false}
            />
            : <div style={{ position: "absolute", zIndex: 1001, top: 100, left: 10, border: 1, borderColor: "red", background: "red" }}>{error}</div>
    );
};


const SetView = ({ center }: { center: LatLng }) => {
    const map = useMap();
    useEffect(() => {
        map.attributionControl.setPrefix(false)
        map.setView(center, 17);
    }, [map, center]);
    return null;
};

// Define the bounds for the image
const imageBounds: LatLngBoundsExpression = [
    [35.713897, -78.456665], // bottom-left corner
    [35.721622, -78.449455]  // top-right corner
];

interface ImageOverlayWithOpacityProps {
    bottomLeftPosition: LatLng;
    topRightPosition: LatLng;
    imageUrl: string;
}

const ImageOverlayWithOpacity = ({ imageUrl, bottomLeftPosition, topRightPosition }: { imageUrl: string, bottomLeftPosition: LatLng, topRightPosition: LatLng }) => {
    const [opacity, setOpacity] = useState(1); // Adjust initial transparency
    const overlayRef = useRef<LeafletImageOverlay | null>(null);
    const [bounds, setBounds] = useState(imageBounds);

    const map = useMap();
    useEffect(() => {
        map.invalidateSize();
    }, []);
    setTimeout(function () {
        console.log("map size invalidated");
        map.invalidateSize();
    }, 0);


    const newBounds: LatLngBoundsExpression = [
        [bottomLeftPosition.lat, bottomLeftPosition.lng], // top-right corner
        [topRightPosition.lat, topRightPosition.lng]  // bottom-left corner,
    ];

    console.log("ImageOverlayWithOpacity Rendered: new bounds", newBounds);

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
            bubblingMouseEvents={false}
                
            eventHandlers={{
                    click: () => {
                        console.log('overlay clicked')
                    },
                }}
        */ }

            <ImageOverlay url={imageUrl}
                ref={overlayRef}
                bounds={newBounds} opacity={opacity} interactive={true}
            />
        </>
    );
};

const LocationMarker: React.FC = () => {
    const [position, setPosition] = useState<LatLngExpression | null>(null);
    const [initialPosition, setInitialPosition] = useState<LatLngExpression>([0, 0]);
    const [selectedPosition, setSelectedPosition] = useState<LatLngExpression>([0, 0]);

    const map = useMap();
    console.log(`map zoom: ${map.getZoom()}`);

    const mapEvent = useMapEvents({
        click(e) {
            console.log("click", e.latlng);
            console.log(e);
            setSelectedPosition([
                e.latlng.lat,
                e.latlng.lng
            ] as LatLngExpression);
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

    return position ?
        <Marker
            key={12}
            position={selectedPosition}
            interactive={false}
        />
        : null
};

const initialLeftBottomPosition = {
    lat: 35.71379969931505,
    lng: -78.45937192440034,
}

const initialTopRightPosition = {
    lat: 35.721909416520184,
    lng: -78.44934582710266,
}

// Define the bounds for the image and max bounds
const bounds: LatLngBoundsExpression = [
    [initialLeftBottomPosition.lat, initialLeftBottomPosition.lng], // top-right corner
    [initialTopRightPosition.lat, initialTopRightPosition.lng]  // bottom-left corner,
];

const ResizableImageLayer = ({ initialBottomLeftPosition, initialTopRightPosition }: { initialBottomLeftPosition: LatLng, initialTopRightPosition: LatLng }) => {
    const [draggable, setDraggable] = useState(false)
    const [bottomLeftPosition, setBottomLeftPosition] = useState(initialBottomLeftPosition)
    const [topRightPosition, setTopRightPosition] = useState(initialTopRightPosition)

    const markerRef = useRef<L.Marker | null>(null)
    const topRightMarkerRef = useRef<L.Marker | null>(null)

    const eventHandlersBottomLeft = useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current
                if (marker != null) {
                    setBottomLeftPosition(marker.getLatLng())
                }
            },
        }),
        [],
    )

    const eventHandlersTopRight = useMemo(
        () => ({
            dragend() {
                const marker = topRightMarkerRef.current
                if (marker != null) {
                    setTopRightPosition(marker.getLatLng())
                }
            },
        }),
        [],
    )
    const toggleDraggable = useCallback(() => {
        setDraggable((d) => !d)
    }, [])

    return (
        <><Marker
            draggable={draggable}
            eventHandlers={eventHandlersTopRight}
            position={topRightPosition}
            ref={topRightMarkerRef}>
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
                ref={markerRef}>
                <ImageOverlayWithOpacity
                    bottomLeftPosition={bottomLeftPosition as LatLng}
                    topRightPosition={topRightPosition as LatLng}
                    imageUrl={mapImageUrl} />
                <Popup minWidth={90}>
                    <span onClick={toggleDraggable}>
                        {draggable
                            ? `Marker is draggable ${bottomLeftPosition.lat}, ${bottomLeftPosition.lng}`
                            : `Click here to make marker draggable  ${bottomLeftPosition.lat}, ${bottomLeftPosition.lng}`}
                    </span>
                </Popup>
            </Marker>
        </>
    )
}

const DraggableMarker = ({ initialPosition }: { initialPosition: LatLng }) => {
    const [draggable, setDraggable] = useState(false)
    const [position, setPosition] = useState(initialPosition)

    const markerRef = useRef<L.Marker | null>(null)

    const eventHandlers = useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current
                if (marker != null) {
                    console.log("dragend", marker.getLatLng())
                    setPosition(marker.getLatLng())
                }
            },
        }),
        [],
    )

    const toggleDraggable = useCallback(() => {
        setDraggable((d) => !d)
    }, [])

    return (
        <Marker
            icon={customIcon}
            key={211}
            draggable={draggable}
            eventHandlers={eventHandlers}
            position={position}
            ref={markerRef}>
            <Popup minWidth={90}>
                <span onClick={toggleDraggable}>
                    {draggable
                        ? `Marker is draggable ${position.lat}, ${position.lng}`
                        : `Click here to make marker draggable  ${position.lat}, ${position.lng}`}
                </span>
            </Popup>
        </Marker>
    )
}

const PopupMarker = ({ index, poi }: { index: number, poi: PointOfInterest }) => {
    console.log("PopupMarker Rendered: ", poi);
    const position = {
        lat: poi.lat,
        lng: poi.lng,
    }
    return (
        <Marker
            key={index}
            icon={customIcon}
            position={position as LatLng}

        >
            <Popup minWidth={90}    >
                <span>{poi.name}</span>
            </Popup>
        </Marker>
    )
}

interface PointOfInterest {
    id: number;
    lat: number;
    lng: number;
    type: string;
    name: string;
    icon: string;
    description: string;
    image: string;
    route: string;
    isVisible: boolean;
}

interface MyMapProps {
    centerOn?: string;
}

interface POIFilter {
    type: string;
    isVisible: boolean;
}

const MyMap: React.FC<MyMapProps> = ({ centerOn }) => {

    const [poiFilters, setPOIFilters] = useState([] as POIFilter[]);

    const SHEET_ID = import.meta.env
        .VITE_REACT_APP_GOOGLE_SHEET_RACING_INFO_ID as string;
    const RANGE = 'MapData!A:I'; // Adjust range based on racer data (e.g., A:C for 3 columns)


    const { data, loading, error, refetch } = useGoogleSheets(SHEET_ID, RANGE);
    const pointsOfInterest = useMemo(() => {
        if (!data) return [];
        return data.slice(1).map(([id, lat, lng, type, name, icon, description, image, route]: string[]) => ({
            id: Number(id),
            lat: Number(lat),
            lng: Number(lng),
            type,
            name,
            icon,
            description,
            image,
            route,
            isVisible: false,
        }));
    }, [data]); // ✅ Only recomputes when `data` changes

    useEffect(() => {
        const poiFilters = [...new Set(pointsOfInterest.map(poi => poi.type))].map(t => ({ type: t, isVisible: true }))
        setPOIFilters(poiFilters);
    }, [pointsOfInterest]); // ✅ Only runs when `pointsOfInterest` changes

    const handlePOIFilterClick = useCallback((poiFilter: POIFilter) => {
        console.log("handlePOIFilterClick", poiFilter);
        setPOIFilters((prev) => {
            const poiFilters = prev.map(f =>
                f.type === poiFilter.type ? { ...f, isVisible: !f.isVisible } : f);
            console.log("poiFilters", poiFilters);
            return poiFilters;

        }
        );
    }, [poiFilters])

    console.log("pointsOfInterest", pointsOfInterest);

    const position = {
        lat: 35.7211377702728,
        lng: -78.4535666961670,
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
            <div>
                <IonToolbar key={4} color={'primary'}>
                    {loading ? <IonChip>...</IonChip> : error ? <span>{error.message}</span> :
                        poiFilters.map(poiFilter => (<IonChip onClick={() => handlePOIFilterClick(poiFilter)} outline={!poiFilter.isVisible} key={poiFilter.type}>{poiFilter.type}</IonChip>))}
                </IonToolbar>
            </div>
            <div style={{ flexGrow: 1 }}>
                <MapContainer
                    maxBounds={bounds}
                    zoomControl={false}
                    style={{ height: "100%", width: "100%" }}
                    minZoom={16}
                >
                    <SetView center={position as LatLng}
                    />
                    <LocationTracker />
                    {/*
                        <LocationMarker />
                        <DraggableMarker initialPosition={position as LatLng} />

                     */}
                    <>

                        {pointsOfInterest.map((poi, index) => {
                            const filter = poiFilters.find(poiFilter => poiFilter.type === poi.type && poiFilter.isVisible);
                            return filter ? ( // Explicit return statement
                                <PopupMarker
                                    key={index}
                                    index={index}
                                    poi={poi}
                                />
                            ) : null; // Return `null` for items that shouldn't render
                        })}
                    </>

                    <ImageOverlayWithOpacity
                        bottomLeftPosition={initialLeftBottomPosition as LatLng}
                        topRightPosition={initialTopRightPosition as LatLng}
                        imageUrl={mapImageUrl} />
                    {/*
                    <TileLayer
                                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                                />
                    <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    attribution="Tiles &copy; Esri"
                    />
                    */}
                </MapContainer>
            </div>
        </div>
    );
};

export default MyMap;
