'use client'

import { PageLoader } from '@/components/_component/PageLoader';
import { getCurrent } from '@/features/auth/queries';
import { useToast } from '@/hooks/use-toast';
import { useGetMeeting } from '@/hooks/useGetMeetings';
import { Call, CallRecording } from '@stream-io/video-react-sdk';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import MeetingListCard from './MeetingCard';


interface CallListProps {
    type: 'ended' | 'upcoming' | 'recordings'
    id: string
}

const CallList = ({ type , id}: CallListProps) => {
    const router = useRouter();
    console.log('call id',id)

    const { endedCalls, upcomingCalls, callRecordings, isCallLoading } =
    useGetMeeting({id});
  const [recordings, setRecordings] = useState<CallRecording[]>([]);


  const getCalls = () => {
    switch (type) {
      case 'ended':
        return endedCalls;
      case 'recordings':
        return recordings;
      case 'upcoming':
        return upcomingCalls;
      default:
        return [];
    }
  };

  const getNoCallsMessage = () => {
    switch (type) {
      case 'ended':
        return 'No Previous Calls';
      case 'upcoming':
        return 'No Upcoming Calls';
      case 'recordings':
        return 'No Recordings';
      default:
        return '';
    }
  };


  const formatDate = (date: string | Date | undefined) => {
    // Handle invalid date
    if (!date) return 'N/A';

    const parsedDate = new Date(date); // Parsing the ISO date string

    if (isNaN(parsedDate.getTime())) return 'N/A'; // Fallback if parsing fails

    // Format date using toLocaleString for a more readable format
    return parsedDate.toLocaleString('en-US', {
        weekday: 'short',   
        year: 'numeric',    
        month: 'short',   
        day: 'numeric',   
        hour: 'numeric',  
        minute: 'numeric',  
        second: 'numeric',  
        hour12: true,     
    });
};



useEffect(() => {
    const fetchRecordings = async () => {
        try {
            
            const callData = await Promise.all(
                callRecordings?.map((meeting) => meeting.queryRecordings()) ?? [],
              );
        
              const recordings = callData
                .filter((call) => call.recordings.length > 0)
                .flatMap((call) => call.recordings);
        
              setRecordings(recordings);
        } catch (error) {
            // toast({title: 'Try again later'})
            toast.error('Try again later')
            console.log(error)
        }
    };

    if (type === 'recordings') {
      fetchRecordings();
    }
  }, [type, callRecordings]);

  if (isCallLoading) return <PageLoader />;

  const calls = getCalls();
  const noCallsMessage = getNoCallsMessage();

  const MeetingLink = `${window.location.origin}`

  console.log(calls)
  console.log(noCallsMessage)

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
    {calls && calls.length > 0 ? (
      calls.map((meeting: Call | CallRecording) => (
        <MeetingListCard
          key={(meeting as Call).id}
          icon={
            type === 'ended'
              ? '/icons/previous.svg'
              : type === 'upcoming'
                ? '/icons/upcoming.svg'
                : '/icons/recordings.svg'
          }
          title={
            (meeting as Call).state?.custom?.title ||
            (meeting as CallRecording).filename?.substring(0, 20) ||
            'No Title'
          }
          desc={type === 'recordings' ? '' : (meeting as Call).state?.custom?.description  }
          date={type ==='recordings' ? (meeting as CallRecording).start_time?.toLocaleString() : formatDate((meeting as Call).state?.startsAt) }
          isPreviousMeeting={type === 'ended'}
          link={
            type === 'recordings'
              ? (meeting as CallRecording).url
              : `${MeetingLink}/call/${(meeting as Call).id}`
          }
          buttonIcon1={type === 'recordings' ? '/icons/play.svg' : undefined}
          buttonText={type === 'recordings' ? 'Play' : 'Start'}
          handleClick={
            type === 'recordings'
              ? () => router.push(`${(meeting as CallRecording).url}`)
              : () => router.push(`/call/${(meeting as Call).id}`)
          }
        />
      ))
    ) : (
      <h1 className="text-2xl font-bold text-black">{noCallsMessage}</h1>
    )}
  </div>
  )
}

export default CallList