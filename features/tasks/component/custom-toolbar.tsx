import React from 'react'
import { CalendarDays , ChevronLeftIcon, ChevronRightIcon} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'

interface CustomToolbarProps {
    date : Date
    handleNavigate: (action: "PREV" | "NEXT" | "TODAY") => void
}

export const CustomToolbar = ({date, handleNavigate}:CustomToolbarProps) => {
  return (
    <div className='flex mb-4 gap-x-2 items-center w-full lg:w-auto justify-center lg:justify-start'>
        <Button 
        onClick={() => handleNavigate('PREV')}
        variant={"secondary"}
        size={"icon"}
        className=' flex items-center'
        >
            <ChevronLeftIcon  className='size-4'/>
        </Button>
        <div  className='flex items-center border border-input rounded-md px-3 py-2 h-8 justify-center w-full lg:w-auto'>
            <CalendarDays className='size-4 mr-2 '/>
                <p>{format(date, 'MMMM yyyy')}</p>
        </div>
        <Button 
        onClick={() => handleNavigate('NEXT')}
        variant={"secondary"}
        size={"icon"}
        className=' flex items-center'
        >
            <ChevronRightIcon  className='size-4'/>
        </Button>
        <Button 
        onClick={() => handleNavigate('TODAY')}
        variant={"secondary"}
        // size={""}
        className=' flex items-center'
        >
            <p>Today</p>
        </Button>
    </div>
  )
}
