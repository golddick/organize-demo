import { useQuery } from "@tanstack/react-query";
import {client} from '@/lib/rpc'
import { InferResponseType } from "hono";

interface UseGetWorkspaceAnalyticsProps{
    workspaceID: string
}

export type WorkspaceAnalyticsResponseType = InferResponseType<typeof client.api.workspaces[':workspaceID']['analytics']['$get'], 200>

export const UseGetWorkspaceAnalytics = ({workspaceID}:UseGetWorkspaceAnalyticsProps) => {
    const query = useQuery({
        queryKey:['workspace-analytics', workspaceID],
        queryFn:async () => {
            const response = await client.api.workspaces[':workspaceID']['analytics'].$get({param:{workspaceID}})

            if (!response.ok) {
                throw new Error ('Failed to fetch workspace analytics')
            }

            const {data} = await response.json()

            return data;
        }
    })

    return query;
} 