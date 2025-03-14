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

    return mappedData.sort((a, b) =>
      parseInt(a.order) > parseInt(b.order)
        ? 1
        : parseInt(a.order) < parseInt(b.order)
        ? -1
        : 0
    );
  }, [data]);

  return { sponsors, loading, error, refetch };
};

export default useSponsors;
