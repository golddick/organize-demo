'use client'

import { Button } from '@/components/ui/button'
import { DeviceSettings, VideoPreview, useCall } from '@stream-io/video-react-sdk'
import React, { useEffect, useState } from 'react'

interface MeetingSetupProps {
    setIsSetupCompleted: (value:boolean) => void
}

export const MeetingSetup = ({setIsSetupCompleted}:MeetingSetupProps) => {

    const [isMicCamToggledOn, setIsMicCamToggledOn] = useState(false)
    const call = useCall()

    if (!call) {
        throw new Error ('useCall must be used within the streamCall component')
    }

    useEffect(() => {

        if (isMicCamToggledOn) {
            call?.camera.disable();
            call?.microphone.disable()
        }else {
            call?.camera.enable();
            call?.microphone.enable()
        }

    },[isMicCamToggledOn, call?.camera, call?.microphone])

  return (
    <div className='flex   h-full  w-full flex-col items-center justify-center gap-3  relative'>
        <h1 className='text-2xl font-bold'>Meeting Setup</h1>
        <VideoPreview className=' border-none' />
        <div className='flex h-16 items-center justify-center gap-3'>
            <label className='flex items-center justify-center gap-2 font-medium'>
                <input
                type='checkbox'
                checked={isMicCamToggledOn}
                onChange={() => setIsMicCamToggledOn(!isMicCamToggledOn)}
                />
                <span>Join with mic and camera off</span>
            </label>
            <DeviceSettings/>
        </div>
        <Button variant={'default'}  className='rounded-md  text-white px-4 py-2' onClick={() => {call.join();
        setIsSetupCompleted(true)
        }}>
            Join meeting
        </Button>
    </div>
  )
}
