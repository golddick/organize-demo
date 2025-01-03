'use client'


import { PageLoader } from '@/components/_component/PageLoader'
import { Alert } from '@/components/ui/alert'
import { MeetingRoom } from '@/features/meeting/MeetingRoom'
import { MeetingSetup } from '@/features/meeting/MeetingSetup'
import { useCallID } from '@/features/meeting/use-CallID'
import { useGetCallByID } from '@/hooks/useGetCallByID'


import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk'
import React, { useState } from 'react'


interface PersonalRoomClientProps {
  user: {
    $id: string;
    name: string;
    meetingId?: string; 
  };
}



export const MeetingPageClient =  ( ) => {
  const id = useCallID()
  const {call, isCallLoading} = useGetCallByID(id)
  const [isSetupComplete, setIsSetupCompleted] = useState(false)

  if ( isCallLoading ) {
    return <PageLoader/>
  }
  if (!call) return (
    <p className="text-center text-3xl font-bold text-white">
      Call Not Found 
    </p>
  );

  // const notAllowed = call.type === 'invited' && (!user || !call.state.members.find((m) => m.user.id === user.id));

  // if (notAllowed) return <Alert title="You are not allowed to join this meeting!" />;


  return (
    <main className='h-full  w-full '>
    <StreamCall call={call}>
      <StreamTheme>
        {!isSetupComplete? (
          <MeetingSetup setIsSetupCompleted={setIsSetupCompleted}/>
        ): (
          <MeetingRoom/>
        )}
      </StreamTheme>
    </StreamCall>
</main>
  )
}
