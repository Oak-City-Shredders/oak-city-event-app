import React, { useEffect, useState, useMemo } from 'react';
import {
  IonIcon,
  IonCard,
  IonButton,
  IonCardContent,
  IonText,
  IonLabel,
} from '@ionic/react';
import {
  chevronBack,
  chevronForward,
  fastFood,
  fastFoodOutline,
} from 'ionicons/icons';
import useFireStoreDB from '../hooks/useFireStoreDB';
import {
  mapFoodTruckData,
  FireDBFoodTruck,
  MappedFoodTruck,
  statusOrder,
} from '../utils/foodTruckUtils'; // Updated import
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation'; // Import navigation styles
import type { Swiper as SwiperType } from 'swiper';
import { Pagination, Navigation } from 'swiper/modules';
import styles from './FoodTruckSwiper.module.css';
import './FoodTruckSwiper.css';

const FoodTruckSwiper: React.FC = () => {
  const {
    data: foodTrucks,
    loading,
    error,
  } = useFireStoreDB<FireDBFoodTruck>('FoodTrucks');

  const mappedFoodTrucks: MappedFoodTruck[] = useMemo(() => {
    if (loading || error || !foodTrucks || foodTrucks.length < 1) {
      return [];
    }
    return mapFoodTruckData(foodTrucks);
  }, [foodTrucks, loading, error]);

  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [swiper, setSwiper] = useState<SwiperType | null>(null);

  // State to store the selected racer ID after the first query
  const [sortedFoodTrucks, setsortedFoodTrucks] = useState<MappedFoodTruck[]>(
    []
  );

  // Select a random racer once data is available
  useEffect(() => {
    if (mappedFoodTrucks && mappedFoodTrucks.length > 0) {
      setsortedFoodTrucks(customSort(mappedFoodTrucks));
    }
  }, [mappedFoodTrucks]);

  if (loading || error || mappedFoodTrucks.length < 1) {
    return <></>;
  }

  // Define the desired order

  function customSort(array: MappedFoodTruck[]): MappedFoodTruck[] {
    // Create a copy of the array to avoid modifying the original
    const shuffledArray = [...array];

    // Sort the array
    return shuffledArray.sort((a, b) => {
      // First compare based on status order
      const statusCompare =
        statusOrder[a.statusMessage] - statusOrder[b.statusMessage];

      // If status messages are different, return the status comparison
      if (statusCompare !== 0) {
        return statusCompare;
      }

      // If status messages are the same, return random order (-1, 0, or 1)
      return Math.random() - 0.5;
    });
  }

  const handleSlideChange = (swiper: SwiperType) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  const handlePrev = () => {
    if (swiper) {
      swiper.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiper) {
      swiper.slideNext();
    }
  };

  const handleCardClick = (route: string): void => {
    console.log('route', route);
    window.open(route, '_blank');
  };

  return (
    <>
      <IonText className={styles.title}>
        <IonLabel>
          <IonIcon slot="start" icon={fastFoodOutline} />
          Food Trucks
        </IonLabel>
      </IonText>
      <IonCard className={styles.container} onClick={undefined}>
        <IonCardContent className={styles.carouselContainer}>
          <Swiper
            modules={[Pagination, Navigation]}
            pagination={{
              clickable: true,
              el: '.custom-pagination', // Custom class for styling
            }}
            onSwiper={setSwiper}
            onSlideChange={handleSlideChange}
            className={styles.swiper}
          >
            {sortedFoodTrucks.map((truck, index) => (
              <SwiperSlide key={index}>
                <div className={styles.slide}>
                  <img
                    src={truck.image}
                    alt={truck.title}
                    className={styles.slideImage}
                  />
                  <div className={styles.topRowContainer}>
                    <IonText className={styles.truckName}>
                      {truck.title}
                    </IonText>
                    <div
                      className={`${styles.statusBadge} ${
                        truck.statusMessage === 'Now Serving'
                          ? styles.statusBadgeServing
                          : styles.statusBadgeClosed
                      }`}
                    >
                      {truck.statusMessage}
                    </div>
                  </div>
                  <div className={styles.bottomRowContainer}>
                    {truck.popularItem ? (
                      <IonButton
                        className={styles.menuButton}
                        color={'light'}
                        fill="solid"
                        slot="end"
                        size={'small'}
                      >
                        <div className={styles.popularItem}>
                          {truck.popularItem}
                        </div>
                        <div className={styles.itemPrice}>
                          {truck.popularItemPrice}
                        </div>
                      </IonButton>
                    ) : (
                      <div></div>
                    )}
                    {truck.route && (
                      <IonButton
                        className={styles.menuButton}
                        color={'light'}
                        fill="solid"
                        slot="end"
                        size={'small'}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCardClick(truck.route);
                        }}
                      >
                        <IonIcon slot="start" icon={fastFood}></IonIcon>
                        Menu
                      </IonButton>
                    )}
                  </div>
                </div>
              </SwiperSlide>
            ))}
            <div className="custom-pagination swiper-pagination"></div>{' '}
            {/* Custom Pagination */}
          </Swiper>
          {/* Custom Navigation Buttons */}
          {!isBeginning && (
            <IonButton
              color={'medium'}
              size="small"
              onClick={handlePrev}
              className={`${styles.navigationButton} ${styles.navigationButtonPrev}`}
            >
              <IonIcon icon={chevronBack} />
            </IonButton>
          )}
          {!isEnd && (
            <IonButton
              color={'medium'}
              size="small"
              onClick={handleNext}
              className={`${styles.navigationButton} ${styles.navigationButtonNext}`}
            >
              <IonIcon icon={chevronForward} />
            </IonButton>
          )}
        </IonCardContent>
      </IonCard>
    </>
  );
};

export default FoodTruckSwiper;
