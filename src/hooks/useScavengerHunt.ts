import { useMemo } from 'react';
import useFireStoreDB from './useFireStoreDB';

interface FireDBScavengerHunt {
  id: string;
  image_link: string;
  name: string;
  description: string;
  order: string;
  sponsorship_tier: string;
  website_link: string;
  prize: string;
}

const useScavengerHunt = () => {
  const { data, loading, error, refetch } =
    useFireStoreDB<FireDBScavengerHunt>('ScavengerHunt');
  const scavengerHunt = useMemo(() => {
    if (!data) return [];

    const mappedData = data
      .filter((scavengerHuntPrize) => scavengerHuntPrize.name.trim() !== '')
      .map((scavengerHuntPrize) => ({
        id: scavengerHuntPrize.id,
        imageLink: scavengerHuntPrize.image_link,
        name: scavengerHuntPrize.name,
        description: scavengerHuntPrize.description,
        order: scavengerHuntPrize.order,
        sponsorshipTier: scavengerHuntPrize.sponsorship_tier,
        websiteLink: scavengerHuntPrize.website_link,
        prize: scavengerHuntPrize.prize,
      }));

    return mappedData.sort((a, b) => {
      // Convert to numbers for reliable numeric comparison
      const orderA = parseInt(a.order) || 0;
      const orderB = parseInt(b.order) || 0;
      return orderA - orderB;
    });
  }, [data]);

  return { scavengerHunt, loading, error, refetch };
};

export default useScavengerHunt;
