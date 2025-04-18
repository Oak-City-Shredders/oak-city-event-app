import React, { useEffect, useState, useMemo } from 'react';
import {
  IonIcon,
  IonCard,
  IonButton,
  IonCardContent,
  IonText,
} from '@ionic/react';
import { chevronBack, chevronForward, fastFood } from 'ionicons/icons';
import {
  FireDBFoodTruck,
  mapFoodTruckData,
  MappedFoodTruck,
  statusOrder,
} from '../utils/foodTruckUtils';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import type { Swiper as SwiperType } from 'swiper';
import { Pagination, Navigation } from 'swiper/modules';
import styles from './FoodTruckSwiper.module.css';
import './FoodTruckSwiper.css';

interface FoodTruckSwiperProps {
  foodTrucks: FireDBFoodTruck[] | null;
  loading: boolean;
  error: any;
}

const FoodTruckSwiper: React.FC<FoodTruckSwiperProps> = ({
  foodTrucks,
  loading,
  error,
}) => {
  const mappedFoodTrucks: MappedFoodTruck[] = useMemo(() => {
    if (loading || error || !foodTrucks || foodTrucks.length < 1) {
      return [];
    }
    return mapFoodTruckData(foodTrucks).filter((truck) => truck.title);
  }, [foodTrucks, loading, error]);

  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [visibleSlides, setVisibleSlides] = useState<MappedFoodTruck[]>([]);
  const [sortedFoodTrucks, setsortedFoodTrucks] = useState<MappedFoodTruck[]>(
    []
  );

  useEffect(() => {
    if (mappedFoodTrucks && mappedFoodTrucks.length > 0) {
      const sorted = customSort(mappedFoodTrucks);
      setsortedFoodTrucks(sorted);
      setVisibleSlides(sorted.slice(0, 2)); // Show first two
      setIsBeginning(true);
      setIsEnd(sorted.length <= 2);

      // Reset swiper to first slide if available
      if (swiper) {
        swiper.slideTo(0, 0); // Instantly move to first slide
      }
    }
  }, [mappedFoodTrucks]);

  if (loading || error || mappedFoodTrucks.length < 1) {
    return null;
  }

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
    const nextIndex = swiper.activeIndex + 1;
    setIsEnd(swiper.activeIndex >= sortedFoodTrucks.length - 1);
    if (
      swiper.activeIndex >= visibleSlides.length - 1 &&
      sortedFoodTrucks[nextIndex]
    ) {
      // Load the next unseen slide
      setVisibleSlides((prev) => [...prev, sortedFoodTrucks[nextIndex]]);
    }
  };

  const handlePrev = () => swiper?.slidePrev();
  const handleNext = () => swiper?.slideNext();

  const handleMenuClick = (route: string): void => {
    window.open(route, '_blank', 'noopener,noreferrer');
  };

  return (
    <IonCard className={styles.container}>
      <IonCardContent className={styles.carouselContainer}>
        <Swiper
          modules={[Pagination, Navigation]}
          pagination={{
            clickable: true,
            el: '.custom-pagination',
          }}
          onSwiper={setSwiper}
          onSlideChange={handleSlideChange}
          className={styles.swiper}
        >
          {visibleSlides.map((truck, index) => (
            <SwiperSlide key={index}>
              <div className={styles.slide}>
                <img
                  src={truck.image}
                  alt={truck.title}
                  className={styles.slideImage}
                />
                <div className={styles.topRowContainer}>
                  <IonText className={styles.truckName}>{truck.title}</IonText>
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
                    <div />
                  )}
                  {truck.link && (
                    <IonButton
                      className={styles.menuButton}
                      color={'light'}
                      fill="solid"
                      slot="end"
                      size={'small'}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMenuClick(truck.link);
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
        </Swiper>
        {!isBeginning && (
          <IonButton
            color="medium"
            size="small"
            onClick={handlePrev}
            className={`${styles.navigationButton} ${styles.navigationButtonPrev}`}
          >
            <IonIcon icon={chevronBack} />
          </IonButton>
        )}
        {!isEnd && (
          <IonButton
            color="medium"
            size="small"
            onClick={handleNext}
            className={`${styles.navigationButton} ${styles.navigationButtonNext}`}
          >
            <IonIcon icon={chevronForward} />
          </IonButton>
        )}
      </IonCardContent>
    </IonCard>
  );
};

export default FoodTruckSwiper;
