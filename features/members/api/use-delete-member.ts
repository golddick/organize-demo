import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";
import {client} from '@/lib/rpc'


type ResponseType = InferResponseType<typeof client.api.members[':memberID']['$delete'], 200>
type RequestType = InferRequestType<typeof client.api.members[":memberID"]['$delete']>


export const useDeleteMember = () => {
    const queryClient = useQueryClient()
    const mutation = useMutation <
    ResponseType,
    Error,
    RequestType >({
        mutationFn:async ({param}) => {
                const response = await client.api.members[':memberID']['$delete']({param})

                if (!response.ok) {
                    throw new Error('Failed to delete member')
                }

                return await response.json()
        },
        onSuccess:({data}) => {
            toast.success('member deleted')
            queryClient.invalidateQueries({queryKey:['members']})
            queryClient.invalidateQueries({queryKey:['member', data.$id]})
        },
        onError:() => {
            toast.error('Failed to delete member')
        }
    })

    return mutation
} 