import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";
import {client} from '@/lib/rpc'


type ResponseType = InferResponseType<typeof client.api.projects[':projectID']['$delete'], 200>
type RequestType = InferRequestType<typeof client.api.projects[":projectID"]['$delete']>


export const useDeleteProject = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation <
    ResponseType,
    Error,
    RequestType >({
        mutationFn:async ({param}) => {
                const response = await client.api.projects[':projectID']['$delete']({param})

                if (!response.ok) {
                    throw new Error('Failed to delete project')
                }

                return await response.json()
        },
        onSuccess:({data}) => {
            toast.success('project deleted')
            queryClient.invalidateQueries({queryKey:['projects']})
            queryClient.invalidateQueries({queryKey:['projects', data.$id]})
        },
        onError:() => {
            toast.error('Failed to delete project')
        }
    })

    return mutation
} 