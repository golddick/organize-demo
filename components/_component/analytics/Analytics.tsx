import { ProjectAnalyticsResponseType } from '@/features/projects/api/use-get-project-analytics'
import React from 'react'
import { ScrollArea, ScrollBar } from '../../ui/scroll-area'
import { AnalyticsCard } from './AnalyticsCard'


const Analytics = ({data}:ProjectAnalyticsResponseType) => {
  return (
    <ScrollArea className='border-none rounded-lg w-full whitespace-nowrap shrink-0  '>
        <div className='w-full flex flex-row gap-4'>
            <div className='flex items-center flex-1 p-1'>
              <AnalyticsCard
              title='Total Tasks'
              value={data.taskCount}
              variant={data.taskDifference > 0 ? 'up' : 'down'}
              increaseValue={data.taskDifference}
              />
            </div>
            <div className='flex items-center flex-1'>
              <AnalyticsCard
              title='Assigned Tasks'
              value={data.assignedTaskCount}
              variant={data.assignedTaskDifference > 0 ? 'up' : 'down'}
              increaseValue={data.assignedTaskDifference}
              />
            </div>
            <div className='flex items-center flex-1'>
              <AnalyticsCard
              title='Incomplete Tasks'
              value={data.incompleteTaskCount}
              variant={data.incompleteTaskDifference > 0 ? 'up' : 'down'}
              increaseValue={data.incompleteTaskDifference}
              />
            </div>
            <div className='flex items-center flex-1'>
              <AnalyticsCard
              title='Completed Tasks'
              value={data.completedTaskCount}
              variant={data.completedTaskDifference > 0 ? 'up' : 'down'}
              increaseValue={data.completedTaskDifference}
              />
            </div>
            <div className='flex items-center flex-1'>
              <AnalyticsCard
              title='Overdue Tasks'
              value={data.overdueTaskCount}
              variant={data.overdueTaskDifference > 0 ? 'up' : 'down'}
              increaseValue={data.overdueTaskDifference}
              />
            </div>
            
        </div>
        <ScrollBar orientation='horizontal'/>
    </ScrollArea>
  )
}

export default Analytics