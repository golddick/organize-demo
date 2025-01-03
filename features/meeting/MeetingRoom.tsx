import { cn } from '@/lib/utils'
import { CallControls, CallParticipantsList, CallStatsButton, CallingState, PaginatedGridLayout, SpeakerLayout, useCallStateHooks } from '@stream-io/video-react-sdk'
import React, { useState } from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { LayoutListIcon, Users2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSearchParams } from 'next/navigation'
import { EndCallButton } from './EndCallButton'
import { PageLoader } from '@/components/_component/PageLoader'

  

type CallLayoutType = 'grid' | 'speaker-left' | 'speaker-right'

export const MeetingRoom = () => {
    const searchParams = useSearchParams()
    const isPersonalRoom = !!searchParams.get('Personal')
    const { useCallCallingState} = useCallStateHooks()
    const callingState = useCallCallingState()
    const [layout, setLayout] = useState<CallLayoutType>('speaker-left')
    const [showParticipants,  setShowParticipants] = useState (false)

    if (callingState !== CallingState.JOINED) {
        return <PageLoader/>
    }

    const CallLayout = () => {
        switch (layout) {
            case 'grid':
                return<PaginatedGridLayout/>
            case 'speaker-right':
                return <SpeakerLayout
                participantsBarPosition={'left'}
                />
            default:
                return <SpeakerLayout
                participantsBarPosition={'right'}
                /> 
        }
    }
  return (
    <section className='relative h-full w-full overflow-hidden pt-4 text-white'>
        <div className=' flex size-full items-center justify-center'>
            <div className='flex size-full max-w-[1000px] items-center'>
                <CallLayout/>
            </div>
            <div className={cn(' h-auto   bg-muted-foreground rounded-lg p-4 hidden ', showParticipants && 'block')}>
                <CallParticipantsList onClose={() => setShowParticipants(false)} />
            </div>
        </div>

        <div className='fixed bottom-0 flex z-50 gap-4  m-auto flex-wrap  mb-2 items-center  justify-center '>
            <CallControls />
            <DropdownMenu>
                <Button asChild  variant={'ghost'} size={'icon'} className='flex items-center bg-black rounded-full p-2 hover:opacity-75'>
                    <DropdownMenuTrigger >
                        <LayoutListIcon size={20} className='text-white'/>
                    </DropdownMenuTrigger>
                </Button>
            <DropdownMenuContent className='bg-muted-foreground text-white border-none'>
                {['Grid', 'Speaker-Left', 'Speaker-Right'].map((item, index) => (
                    <div key={index}>
                        <DropdownMenuItem className=' cursor-pointer' onClick={() => {
                            setLayout(item.toLocaleLowerCase() as CallLayoutType)
                        }}>
                            {item}
                        </DropdownMenuItem>
                    </div>
                ))}
            </DropdownMenuContent>
            </DropdownMenu>

            <CallStatsButton />
            <Button onClick={() => setShowParticipants((prev) => !prev)} variant={'ghost'} size={'icon'}>
                <div className='flex items-center bg-black rounded-full p-2 hover:opacity-75 cursor-pointer'>
                        <Users2 className=' size-20'/>
                </div>
            </Button>
            {!isPersonalRoom && <EndCallButton/>}
        </div>
    </section>
  )
}
