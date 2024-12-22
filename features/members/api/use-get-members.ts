import { useQuery } from "@tanstack/react-query";
import {client} from '@/lib/rpc'

interface UseGetMembersProps{
    workspaceID: string
}

export const useGetMembers = ({workspaceID}:UseGetMembersProps) => {
    const query = useQuery({
        queryKey:['members', workspaceID],
        queryFn:async () => {
            const response = await client.api.members.$get({query:{workspaceID}})

            if (!response.ok) {
                throw new Error ('Failed to fetch members')
            }

       

            const {data} = await response.json()

            return data;
        }
    })

    return query;
} 