'use client'

import React, { useState } from 'react'
import MeetingCard from './MeetingCard'
import { Calendar, Plus, UserPlus2, VideoIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { MeetingModal } from '../MeetingModal'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { useToast } from '@/hooks/use-toast'
import { v4 as uuidv4 } from 'uuid';
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useWorkspaceID } from '@/features/workspaces/hooks/use-workspaceID'


export const MeetingTypeList = () => {
  const {toast} = useToast()
  // const workspaceID = useWorkspaceID()
  const user = uuidv4()
  const  client = useStreamVideoClient()
  const [meetingState, setMeetingState] = useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>()
  const router = useRouter()
  const [value, setValue] = useState({
    dateTime: new Date(),
    description: '',
    link:'',
    title:''
  })
  const [callDetails, setCallDetails] = useState<Call>()
  const workspaceID= useWorkspaceID()



  const createMeeting = async () => {
    if (!client ) {
      throw new Error('Client  is not defined');
    }
    if ( !user) {
      throw new Error(' user is not defined');
    }

    try {

      if (!value.dateTime) {
        toast({
          title: "Please select a date and a time",
        })
        return
      }
      // Generate a unique ID for the meeting
      const meetingID =  user;
      const call = client.call('default', meetingID);
  
      // Ensure the call was successfully created
      if (!call) {
        throw new Error('Failed to create call');
      }
  
      // Ensure startAt value is valid, fallback to current date/time if not provided
      const startAt = value.dateTime ? value.dateTime.toISOString() : new Date().toISOString();
  
      // Set default description if not provided
      const description = value.description || 'Instant Meeting';
      const title = value.title || 'Meeting'
      const workspace = workspaceID || 'NewCall1'
  
      // Create or fetch the call details
      await call.getOrCreate({
        data: {
          starts_at: startAt,
          custom: {
            description,
            title,
            workspace
            
          },
        },
      });
    
      // Update the call details state
      setCallDetails(call);

        // Redirect to the meeting page if no description is provided
        if (!value.title) {
          router.push(`${window.location.origin}/call/${call.id} `);
        }

        console.log(callDetails?.id)

        toast({
          title: "Meeting created",
        })

        
  
    } catch (error) {
      console.error('Error creating meeting:', error);
      toast({
        title: "Failed to create meeting",
      })
    }
  };

  // const meetingLink = `${window.location.origin}/meetings/${callDetails?.id}`
  const meetingLink = typeof window !== 'undefined' 
  ? `${window.location.origin}/call/${callDetails?.id}` 
  : '';


    
  

  return (
    <section className=' grid grid-cols-2 justify-between w-full gap-5 md:grid-cols-2 xl:grid-cols-4'>
        <MeetingCard
        Icon={<Plus/>}
        header='New Meeting'
        info='Start an instant meeting'
        className='bg-orange-500'
        onClick={() => setMeetingState('isInstantMeeting')}
        />
        <MeetingCard
        Icon={<UserPlus2/>}
        header='Join Meeting'
        info='Via invitation link'
        className='bg-blue-500'
        onClick={() => setMeetingState('isJoiningMeeting')}
        />
        <MeetingCard
        Icon={<Calendar/>}
        header='Schedule Meeting'
        info='Plan your meeting'
        className='bg-purple-500'
        onClick={() => setMeetingState('isScheduleMeeting')}
        />
        <MeetingCard
        Icon={<VideoIcon/>}
        header=' Recordings'
        info='Meeting Recordings'
        className='bg-black'
        onClick={() => router.push('/recordings')}
        />
        {!callDetails ? (
            <MeetingModal
            isOpen={meetingState === 'isScheduleMeeting'}
            onClose={() => setMeetingState(undefined)}
            title='Schedule  Meeting'
            handleClick={createMeeting}
            buttonIcon={<VideoIcon/>}
            >
              <div className='flex flex-col gap-2'>
                 <div>
                 <label className='text-base  font-normal leading-[20px]  '> Meeting Title</label>
                  <Input className='border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-muted text-black' defaultValue={''} onChange={(e) => {
                    setValue({...value, title:e.target.value})
                  }}/>
                 </div>

                 <div>
                 <label className='text-base  font-normal leading-[20px]  '> Meeting Description</label>
                  <Textarea className='border-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-muted text-black' defaultValue={''} onChange={(e) => {
                    setValue({...value, description:e.target.value})
                  }}/>
                 </div>
              </div>
              <div className='flex w-full flex-col gap-2'>
                  <label>Select Date and Time</label>
                  <DatePicker selected={value.dateTime}
                  showTimeSelect
                   onChange={(date) => setValue({
                    ...value,
                    dateTime: date!
                   })}
                   timeCaption='time'
                   dateFormat='MMMM d, yyyy h:mm aa'
                   timeFormat='HH:mm'
                   timeIntervals={15}
                   className='border-none focus:outline-none bg-muted text-black w-full rounded-lg p-2'
                   />
              </div>
            </MeetingModal>
        ): (
          <MeetingModal
          isOpen={meetingState === 'isScheduleMeeting'}
          onClose={() => setMeetingState(undefined)}
          title='Meeting Created'
          className='text-center'
          image='/icons/checked.svg'
          buttonText= 'Copy meeting link'
          handleClick={() => {
            navigator.clipboard.writeText(meetingLink)
            toast({title:'Link copied'})
          }}
          buttonIcon={<VideoIcon/>}
          />
        ) }

    <MeetingModal
        isOpen={meetingState === 'isJoiningMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Type the link here"
        className="text-center"
        buttonText="Join Meeting"
        handleClick={() => router.push(value.link)}
      >
        <Input
          placeholder="Meeting link"
          onChange={(e) => setValue({ ...value, link: e.target.value })}
          className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0 text-black"
        />
      </MeetingModal>

        <MeetingModal
        isOpen={meetingState === 'isInstantMeeting'}
        onClose={() => setMeetingState(undefined)}
        title='Start an Instant Meeting'
        className='text-center'
        buttonText= 'Start Meeting'
        handleClick={createMeeting}
        buttonIcon={<VideoIcon/>}
        />
    </section>
  )
}
