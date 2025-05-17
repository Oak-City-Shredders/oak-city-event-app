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

interface FireDBScavengerHuntDetails {
  id: string;
  title: string;
  description: string;
}

const mapScavengerHuntPrizes = (
  prizeData: FireDBScavengerHunt[] | null | undefined
) => {
  if (!prizeData) return [];

  return prizeData
    .filter((prize) => prize.name.trim() !== '')
    .map((prize) => ({
      id: prize.id,
      imageLink: prize.image_link,
      name: prize.name,
      description: prize.description,
      order: prize.order,
      sponsorshipTier: prize.sponsorship_tier,
      websiteLink: prize.website_link,
      prize: prize.prize,
    }))
    .sort((a, b) => (parseInt(a.order) || 0) - (parseInt(b.order) || 0));
};

const mapScavengerHuntDetails = (
  detailsData: FireDBScavengerHuntDetails[] | null | undefined
) => {
  if (!detailsData) return [];

  return detailsData.map((detail) => ({
    id: detail.id,
    title: detail.title,
    description: detail.description,
  }));
};

const useScavengerHunt = () => {
  const {
    data: prizeData,
    loading: prizeLoading,
    error: prizeError,
    refetch: prizeRefetch,
  } = useFireStoreDB<FireDBScavengerHunt>('ScavengerHunt');

  const {
    data: detailsData,
    loading: detailsLoading,
    error: detailsError,
    refetch: detailsRefetch,
  } = useFireStoreDB<FireDBScavengerHuntDetails>('ScavengerHuntDetails');

  const scavengerHuntPrizes = useMemo(
    () => mapScavengerHuntPrizes(prizeData),
    [prizeData]
  );
  const scavengerHuntDetails = useMemo(
    () => mapScavengerHuntDetails(detailsData),
    [detailsData]
  );

  return {
    scavengerHuntPrizes,
    prizeLoading,
    prizeError,
    prizeRefetch,
    scavengerHuntDetails,
    detailsLoading,
    detailsError,
    detailsRefetch,
  };
};

export default useScavengerHunt;
