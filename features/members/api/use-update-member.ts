import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";
import {client} from '@/lib/rpc'
import { useRouter } from "next/navigation";


type ResponseType = InferResponseType<typeof client.api.members[':memberID']['$patch'], 200>
type RequestType = InferRequestType<typeof client.api.members[":memberID"]['$patch']>


export const useUpdateMember = () => {
    const router = useRouter()
    const queryClient = useQueryClient()
    const mutation = useMutation <
    ResponseType,
    Error,
    RequestType >({
        mutationFn:async ({param ,json}) => {
                const response = await client.api.members[':memberID']['$patch']({param , json})

                if (!response.ok) {
                    throw new Error('Failed to update member')
                }

                return await response.json()
        },
        onSuccess:({data}) => {
            toast.success('member updated')
            queryClient.invalidateQueries({queryKey:['members']})
            queryClient.invalidateQueries({queryKey:['members', data.$id]})
        },
        onError:() => {
            toast.error('Failed to update member')
        }
    })

    return mutation
} 