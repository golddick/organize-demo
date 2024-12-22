import { useQuery } from "@tanstack/react-query";
import {client} from '@/lib/rpc'
import { InferResponseType } from "hono";

interface UseGetProjectAnalyticsProps{
    projectID: string
}

export type ProjectAnalyticsResponseType = InferResponseType<typeof client.api.projects[':projectID']['analytics']['$get'], 200>

export const UseGetProjectAnalytics = ({projectID}:UseGetProjectAnalyticsProps) => {
    const query = useQuery({
        queryKey:['project-analytics', projectID],
        queryFn:async () => {
            const response = await client.api.projects[':projectID']['analytics'].$get({param:{projectID}})

            if (!response.ok) {
                throw new Error ('Failed to fetch project analytics')
            }

            const {data} = await response.json()

            return data;
        }
    })

    return query;
} 