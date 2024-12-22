import { useQuery } from "@tanstack/react-query";
import {client} from '@/lib/rpc'

interface UseGetMembersProps{
    workspaceID: string
}

export const useGetMembersAdmin = ({workspaceID}:UseGetMembersProps) => {
    const query = useQuery({
        queryKey:['members', workspaceID],
        queryFn:async () => {
            const response = await client.api.members.members.admin.$get({query:{workspaceID}})

            if (!response.ok) {
                throw new Error ('Failed to fetch members for admin')
            }

            const {data} = await response.json()

            return data;
        }
    })

    return query;
} 