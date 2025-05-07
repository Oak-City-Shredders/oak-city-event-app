import { useMemo } from 'react';
import useFireStoreDB from './useFireStoreDB';

interface FireDBBand {
  id: string;
  imageUrl: string;
  bandName: string;
  subTitle: string;
  description: string;
  websiteLink: string;
  order: string;
}

const useBands = () => {
  const { data, loading, error, refetch } = useFireStoreDB<FireDBBand>('bands');

  const bands = useMemo(() => {
    if (!data) return [];

    const mappedData = data.map((band) => ({
      id: band.id,
      imageUrl: band.imageUrl,
      name: band.bandName,
      subtitle: band.subTitle,
      description: band.description,
      websiteLink: band.websiteLink,
      sortOrder: band.order,
    }));

    return mappedData.sort((a, b) =>
      parseInt(a.sortOrder) > parseInt(b.sortOrder)
        ? 1
        : parseInt(a.sortOrder) < parseInt(b.sortOrder)
        ? -1
        : 0
    );
  }, [data]);

  return { bands, loading, error, refetch };
};

export default useBands;
