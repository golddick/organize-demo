import { useQuery } from "@tanstack/react-query";
import {client} from '@/lib/rpc'

interface UseGetTaskProps{
    taskID: string;
  
}

export const useGetTask = ({taskID}:UseGetTaskProps) => {
    const query = useQuery({
        queryKey:['task', taskID
        ],
        queryFn:async () => {
            const response = await client.api.tasks[":taskID"].$get({param:{taskID}})

            if (!response.ok) {
                throw new Error ('Failed to fetch task')
            }

            const {data} = await response.json()

            return data;
        }
    })

    return query;
}  