import { useQuery } from "@tanstack/react-query";
import {client} from '@/lib/rpc'

interface UseGetWorkspaceInfoProps{
    workspaceID: string
}

export const useGetWorkspaceInfo = ({workspaceID}:UseGetWorkspaceInfoProps) => {
    const query = useQuery({
        queryKey:['workspace-info', workspaceID],
        queryFn:async () => {
            const response = await client.api.workspaces[':workspaceID']['info'].$get({param:{workspaceID}})

            if (!response.ok) {
                throw new Error ('Failed to fetch workspace info')
            }

            const {data} = await response.json()

            return data;
        }
    })

    return query;
} 