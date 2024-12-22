import React from 'react'
import { Task } from '../types'
import { TaskActions } from './task-action'
import {MoreHorizontal, Dot } from 'lucide-react'
import { DottedSeparator } from '@/components/_component/dotted-separator'
import { MemberAvatar } from '@/features/members/components/member-avatar'
import { TaskDateOnly } from './TaskDateOnly'
import { ProjectAvatar } from '@/features/projects/component/project-avatar'

interface KanbanCardProps {
    task: Task
}

export const KanbanCard = ({task}: KanbanCardProps) => {
  return (
    <div className='bg-white p-2 mb-1.5 rounded shadow-sm space-y-3'> 
        <div className='flex items-start justify-between gap-x-2'>
            <p className='text-sm line-clamp-2'>{task.name}</p>
            <TaskActions id={task.$id} projectID={task.projectID}>
                <MoreHorizontal className=' size-[18px] stroke-1 shrink-0 text-neutral-700 hover:opacity-75 transition'/>
            </TaskActions>
        </div>
        <DottedSeparator color='gold'/>
        <div className='flex items-center gap-x-1.5 overflow-scroll truncate'>
            <MemberAvatar
            name={task.assignee.name}
            fallbackClassName='text-[10px] '
            />

            {/* <div className=' size-1 rounded-full bg-black'/> */}
            <Dot/>
            <TaskDateOnly
            value={task.dueDate}
            className=' text-xs'
            />
        </div>
        {/* <DottedSeparator color='gold'/> */}
        <div  className='flex items-center gap-x-1.5'>
            <ProjectAvatar
            name={task.project.name}
            image={task.project.imageUrl}
            fallbackClassName='text-[10px]'
            />
            <span className=' text-xs font-medium'>{task.project.name}</span>
        </div>
    </div>
  )
}
