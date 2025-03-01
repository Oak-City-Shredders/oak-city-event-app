import { useMemo } from 'react';
import useFireStoreDB from './useFireStoreDB';

interface FireDBTeamMember {
  id: string;
  img_src: string;
  name: string;
  nickname: string;
  role: string;
  sort_order: string;
}

const useTeamMembers = () => {
  const { data, loading, error, refetch } =
    useFireStoreDB<FireDBTeamMember>('team');

  const teamMembers = useMemo(() => {
    if (!data) return [];

    const mappedData = data.map((teamMember) => ({
      id: teamMember.id,
      img_src: teamMember.img_src,
      name: teamMember.name,
      nickname: teamMember.nickname,
      role: teamMember.role,
      sort_order: teamMember.sort_order,
    }));

    return mappedData.sort((a, b) =>
      parseInt(a.sort_order) > parseInt(b.sort_order)
        ? 1
        : parseInt(a.sort_order) < parseInt(b.sort_order)
        ? -1
        : 0
    );
  }, [data]);

  return { teamMembers, loading, error, refetch };
};

export default useTeamMembers;
