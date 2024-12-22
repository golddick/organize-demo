import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";
import {client} from '@/lib/rpc'


type ResponseType = InferResponseType<typeof client.api.tasks[':taskID']['$patch'], 200>
type RequestType = InferRequestType<typeof client.api.tasks[':taskID']['$patch']>


export const useUpdateTask = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation <
    ResponseType,
    Error,
    RequestType >({
        mutationFn:async ({ json, param}) => {
                const response = await client.api.tasks[':taskID']['$patch']({json, param})

                if (!response.ok) {
                    throw new Error('Failed to update task')
                }

                return await response.json()
        },
        onSuccess:({data}) => {
            toast.success(`Task ${data.name} updated`)
            queryClient.invalidateQueries({queryKey:['tasks']})
            queryClient.invalidateQueries({queryKey:['tasks', data.$id]})
        },
        onError:() => {
            toast.error(`Failed to update  task`)
        }
    })

    return mutation
} 