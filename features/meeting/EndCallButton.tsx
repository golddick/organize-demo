'use client'

import { Button } from "@/components/ui/button"
import { useCall, useCallStateHooks } from "@stream-io/video-react-sdk"
import { useRouter } from "next/navigation"

export const EndCallButton = () => {
    const router = useRouter()
    const call = useCall()
    const {useLocalParticipant} = useCallStateHooks()
    const LocalParticipant = useLocalParticipant()

    const isMeetingOwner = LocalParticipant && 
    call?.state.createdBy && LocalParticipant.userId === call.state.createdBy.id;

    if(!isMeetingOwner) return null

    const endCall = async () => {
        await call.endCall()
        console.log('meeting ended')
        router.push('/space')
    }
  return (
    <Button className=" " onClick={endCall} variant={'destructive'}>
        End Call For Everyone
    </Button>
  )
}
