import { useQuery } from "@tanstack/react-query";
import {client} from '@/lib/rpc'

export const useAdminGetWorkspaces = () => {
    const query = useQuery({
        queryKey:['workspaces'],
        queryFn:async () => {
            const response = await client.api.workspaces.$get()

            console.log(response)
            // const response = await client.api.workspaces.admin.workspaces.$get()

            if (!response.ok) {
                throw new Error ('Failed to fetch workspaces for admin')
            }

            const {data} = await response.json()

            return data;
        }
    })

    return query;
}