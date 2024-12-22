import { useQuery } from "@tanstack/react-query";
import {client} from '@/lib/rpc'

interface UseGetProjectProps{
    projectID: string
}

export const useGetAProject = ({projectID}:UseGetProjectProps) => {
    const query = useQuery({
        queryKey:['project', projectID],
        queryFn:async () => {
            const response = await client.api.projects[':projectID'].$get({param:{projectID}})

            if (!response.ok) {
                throw new Error ('Failed to fetch project')
            }

            const {data} = await response.json()

            return data;
        }
    })

    return query;
} 