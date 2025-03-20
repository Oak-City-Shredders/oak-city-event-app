import { FireDBFoodTruck } from '../utils/foodTruckUtils';
import useFireStoreDB from './useFireStoreDB';

export const useFoodTruckData = () => {
  const { data, loading, error, refetch } =
    useFireStoreDB<FireDBFoodTruck>('FoodTrucks');
  return { foodTrucks: data, loading, error, refetch };
};

interface FireDBRacerSpotlight {
  name: string;
  id: string;
}

export const useRandomRacerId = () => {
  const {
    data: spotlightRacers,
    loading,
    error,
    refetch,
  } = useFireStoreDB<FireDBRacerSpotlight>('RacerSpotlight');

  // Select a random racer ID if data is available
  const racerId = spotlightRacers?.length
    ? spotlightRacers[Math.floor(Math.random() * spotlightRacers.length)].id
    : null;

  return { racerId, loading, error, refetch };
};
