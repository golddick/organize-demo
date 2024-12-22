import { useQuery } from "@tanstack/react-query";
import {client} from '@/lib/rpc'

interface UseGetProjectsProps{
    workspaceID: string
}

export const useGetProjectAdmin = ({workspaceID}:UseGetProjectsProps) => {
    const query = useQuery({
        queryKey:['project', workspaceID],
        queryFn:async () => {
            const response = await client.api.projects.admin.projects.$get({query:{workspaceID}})

            if (!response.ok) {
                throw new Error ('Failed to fetch projects in admin')
            }

            const {data} = await response.json()

            return data;
        }
    })

    return query;
} 