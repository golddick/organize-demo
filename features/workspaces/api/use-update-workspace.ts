import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";
import {client} from '@/lib/rpc'


type ResponseType = InferResponseType<typeof client.api.workspaces[':workspaceID']['$patch'], 200>
type RequestType = InferRequestType<typeof client.api.workspaces[':workspaceID']['$patch']>


export const useUpdateWorkspace = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation <
    ResponseType,
    Error,
    RequestType >({
        mutationFn:async ({form, param}) => {
                const response = await client.api.workspaces[':workspaceID']['$patch']({form, param})

                if (!response.ok) {
                    throw new Error('Failed to update Workspace')
                }

                return await response.json()
        },
        onSuccess:({data}) => {
            toast.success(`Workspace ${data.name} updated`)
            queryClient.invalidateQueries({queryKey:['workspaces']})
            queryClient.invalidateQueries({queryKey:['workspaces', data.$id]})
        },
        onError:() => {
            toast.error('Failed to update Workspace')
        }
    })

    return mutation
} 