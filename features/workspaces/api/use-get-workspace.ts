import { useQuery } from "@tanstack/react-query";
import {client} from '@/lib/rpc'

interface UseGetWorkspaceProps{
    workspaceID: string
}

export const useGetAWorkspace = ({workspaceID}:UseGetWorkspaceProps) => {
    const query = useQuery({
        queryKey:['workspaceID', workspaceID],
        queryFn:async () => {
            const response = await client.api.workspaces[':workspaceID'].$get({param:{workspaceID}})

            if (!response.ok) {
                throw new Error ('Failed to fetch workspace')
            }

            const {data} = await response.json()

            return data;
        }
    })

    return query;
} 