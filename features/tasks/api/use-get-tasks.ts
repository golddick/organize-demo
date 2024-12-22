import { useQuery } from "@tanstack/react-query";
import {client} from '@/lib/rpc'

interface UseGetTaskProps{
    workspaceID: string;
    projectID?: string | null;
    status?: string | null;
    assigneeID?: string | null;
    dueDate?: string | null;
    search?: string | null;
}

export const useGetTasks = ({workspaceID,projectID,status,assigneeID,dueDate, search}:UseGetTaskProps) => {
    const query = useQuery({
        queryKey:['tasks',
         workspaceID, 
         projectID,
         status,
         assigneeID,
         dueDate,
         search
        ],
        queryFn:async () => {
            const response = await client.api.tasks.$get({query:{
                workspaceID,
                projectID: projectID ?? undefined,
                assigneeID: assigneeID ?? undefined,
                dueDate: dueDate ?? undefined,
                search: search ?? undefined,
                status: status ?? undefined
            }})

            if (!response.ok) {
                throw new Error ('Failed to fetch task')
            }

            const {data} = await response.json()

            return data;
        }
    })

    return query;
} 