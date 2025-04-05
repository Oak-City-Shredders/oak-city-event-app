import { useMemo } from 'react';
import useFireStoreDB from './useFireStoreDB';

interface FireDBSponsor {
  id: string;
  image_link: string;
  name: string;
  description: string;
  notes: string;
  order: string;
  sponsorship_tier: string;
  website_link: string;
}

const tierPriority = { title: 1, platinum: 2, gold: 3, silver: 4 };

const useSponsors = () => {
  const { data, loading, error, refetch } =
    useFireStoreDB<FireDBSponsor>('Sponsors');
  const sponsors = useMemo(() => {
    if (!data) return [];

    const mappedData = data
      .filter((sponsor) => sponsor.name.trim() !== '')
      .map((sponsor) => ({
        id: sponsor.id,
        imageLink: sponsor.image_link,
        name: sponsor.name,
        description: sponsor.description,
        notes: sponsor.notes,
        order: sponsor.order,
        sponsorshipTier: sponsor.sponsorship_tier,
        websiteLink: sponsor.website_link,
      }));

    return mappedData.sort((a, b) => {
      const tierA =
        tierPriority[
          a.sponsorshipTier.toLowerCase() as keyof typeof tierPriority
        ] || 5;
      const tierB =
        tierPriority[
          b.sponsorshipTier.toLowerCase() as keyof typeof tierPriority
        ] || 5;

      if (tierA !== tierB) {
        return tierA - tierB;
      }

      // If tiers are the same, sort by order
      const orderA = parseInt(a.order) || 0;
      const orderB = parseInt(b.order) || 0;
      return orderA - orderB;
    });
  }, [data]);

  return { sponsors, loading, error, refetch };
};

export default useSponsors;
