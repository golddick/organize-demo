import {FaCaretDown, FaCaretUp} from 'react-icons/fa'

import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { cn } from '@/lib/utils';
  

interface AnalyticsCardProps {
    title: string;
    value: number;
    variant: 'up' | 'down';
    increaseValue: number
}

export const AnalyticsCard = ({title,value,variant,increaseValue}:AnalyticsCardProps) => {
  const iconColor = variant ==='up' ? 'text-emerald-500' : 'text-red-500'
  const Icon = variant ==='up' ? FaCaretUp : FaCaretDown;
  const increaseValueColor = variant === 'up' ? 'text-emerald-500' : 'text-red-500'
    return (
    <Card className='shadow-gold shadow-md border-none w-full '>
        <CardHeader>
            <div className='flex items-center gap-x-2.5'>
                <CardDescription className='flex items-center gap-x-2  overflow-hidden'>
                    <span className='truncate text-base'>{title}</span>
                    <div className='flex items-center gap-x-1'>
                        <Icon className={cn('size-4',iconColor)}/>
                        <span className={cn(increaseValueColor,"truncate, text-base font-medium")}>{increaseValue}</span>
                    </div>
                </CardDescription>
            </div>
            <CardTitle className='3xl font-semibold'>{value}</CardTitle>
        </CardHeader>
    </Card>
  )
}
