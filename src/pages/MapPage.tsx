import {
  IonContent,
  IonPage,
} from '@ionic/react';
import React from 'react';
import { useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import MyMap from '../components/Map';
import useGoogleSheets from '../hooks/useGoogleSheets';
import { LatLngBoundsExpression } from 'leaflet';
import { POIFilter } from '../components/Map';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { IonBackButton, IonButtons, IonChip, IonHeader, IonItem, IonTitle, IonToolbar } from '@ionic/react';
import "./MapPage.css";
import { useRef } from 'react';
import { useMap } from 'react-leaflet';

interface RouteParams {
  locationName: string;

}

interface ChipToolbarProps {
  poiFilters: POIFilter[];
  error: Error | null;
  loading: boolean;
  handlePOIFilterClick: (poiFilter: POIFilter) => void
}

const ChipToolbar: React.FC<ChipToolbarProps> = ({ poiFilters, error, loading, handlePOIFilterClick }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleDrag = (event: React.MouseEvent | React.TouchEvent) => {
    if (!scrollContainerRef.current) return;

    const scrollContainer = scrollContainerRef.current;
    let startX: number;
    let scrollLeft: number;

    if ("touches" in event) {
      startX = event.touches[0].pageX - scrollContainer.offsetLeft;
    } else {
      startX = event.pageX - scrollContainer.offsetLeft;
    }

    scrollLeft = scrollContainer.scrollLeft;

    const moveHandler = (moveEvent: MouseEvent | TouchEvent) => {
      let x: number;
      if ("touches" in moveEvent) {
        x = moveEvent.touches[0].pageX - scrollContainer.offsetLeft;
      } else {
        x = moveEvent.pageX - scrollContainer.offsetLeft;
      }

      const walk = x - startX;
      scrollContainer.scrollLeft = scrollLeft - walk;
    };

    const endHandler = () => {
      document.removeEventListener("mousemove", moveHandler);
      document.removeEventListener("mouseup", endHandler);
      document.removeEventListener("touchmove", moveHandler);
      document.removeEventListener("touchend", endHandler);
    };

    document.addEventListener("mousemove", moveHandler);
    document.addEventListener("mouseup", endHandler);
    document.addEventListener("touchmove", moveHandler);
    document.addEventListener("touchend", endHandler);
  };

  return (

    <div
      className="chip-scroll-container"
      ref={scrollContainerRef}
      onMouseDown={handleDrag}
      onTouchStart={handleDrag}
    >
      {loading ? <IonChip>...</IonChip> : error ? <span>{error.message}</span> :
        poiFilters.map((poiFilter, index) => (poiFilter.type !== "ClickMe" && poiFilter.type !== "Label") ? (

          <IonChip
            onClick={() => handlePOIFilterClick(poiFilter)}
            outline={!poiFilter.isVisible}
            key={index}
            className="chip"
          >{poiFilter.type}</IonChip>

        ) : null)}

    </div>

  );
};



const MapPage: React.FC = () => {
  console.log("MapPage");
  const { locationName } = useParams<RouteParams>();
  const [poiFilters, setPOIFilters] = useState([] as POIFilter[]);

  const SHEET_ID = import.meta.env
    .VITE_REACT_APP_GOOGLE_SHEET_RACING_INFO_ID as string;
  const RANGE = 'MapData!A:P'; // Adjust range based on racer data (e.g., A:C for 3 columns)


  const { data, loading, error, refetch } = useGoogleSheets(SHEET_ID, RANGE);
  const pointsOfInterest = useMemo(() => {

    if (!data) return [];
    console.log("pointsOfInterest");
    return data.slice(1).map(([id, lat, lng, type, name,
      icon, isImage, description, image, route, iconSize, iconAnchor, iconPopupAnchor, boundsLeftBottom, boundsTopRight, toolTipOffset
    ]: string[]) => ({
      id: Number(id),
      lat: Number(lat),
      lng: Number(lng),
      type,
      name,
      icon,
      description,
      image,
      route,
      iconSize: iconSize ? iconSize.split(",").map(Number) : [24, 24],
      iconAnchor: iconAnchor ? iconAnchor.split(",").map(Number) : [12, 12],
      popupAnchor: iconPopupAnchor ? iconPopupAnchor.split(",").map(Number) : [1, -34],
      isImage: isImage === "Image",
      bounds: boundsLeftBottom && boundsTopRight ? [
        [Number(boundsLeftBottom.split(",")[0]), Number(boundsLeftBottom.split(",")[1])],
        [Number(boundsTopRight.split(",")[0]), Number(boundsTopRight.split(",")[1])]
      ] as LatLngBoundsExpression : undefined,
      toolTipOffset: toolTipOffset ? toolTipOffset.split(",").map(Number) : [0, -20],
      isVisible: true,
    }));
  }, [data]); // ✅ Only recomputes when `data` changes

  useEffect(() => {
    const poiFilters = [...new Set(pointsOfInterest.map(poi => poi.type))].map(t => ({ type: t, isVisible: t !== "ClickMe" }))
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

  const position = {
    lat: 35.7211377702728,
    lng: -78.4535666961670,
  }



  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color={'primary'}>
          <ChipToolbar poiFilters={poiFilters} loading={loading} error={error} handlePOIFilterClick={handlePOIFilterClick} />
        </IonToolbar>
      </IonHeader>
      <IonContent style={{ height: "200px", width: "100vw" }} >
        <MyMap centerOn={locationName} poiFilters={poiFilters} pointsOfInterest={pointsOfInterest} />
      </IonContent>
    </IonPage>
  );
};

export default MapPage;
