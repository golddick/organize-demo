import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";
import {client} from '@/lib/rpc'



type ResponseType = InferResponseType<typeof client.api.tasks[':taskID']['$delete'], 200>
type RequestType = InferRequestType<typeof client.api.tasks[":taskID"]['$delete']>


export const useDeleteTask = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation <
    ResponseType,
    Error,
    RequestType >({
        mutationFn:async ({param}) => {
                const response = await client.api.tasks[':taskID']['$delete']({param})

                if (!response.ok) {
                    throw new Error('Failed to delete task')
                }

                return await response.json()
        },
        onSuccess:({data}:any) => {
            toast.success('Task deleted')
            queryClient.invalidateQueries({queryKey:['tasks']})
            queryClient.invalidateQueries({queryKey:['tasks', data.$id]})
        },
        onError:() => {
            toast.error('Failed to delete task')
        }
    })

    return mutation
} 