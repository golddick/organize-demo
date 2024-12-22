import React from 'react'
import { TaskStatus } from '../types'
import { Project } from '@/features/projects/types'
import { cn } from '@/lib/utils'
import { MemberAvatar } from '@/features/members/components/member-avatar'
import { ProjectAvatar } from '@/features/projects/component/project-avatar'
import { useWorkspaceID } from '@/features/workspaces/hooks/use-workspaceID'
import { useRouter } from 'next/navigation'
import { Member } from '@/features/members/types'

interface EventCardProps {
    id: string
    title: string
    project: Project
    assignee: Member
    status: TaskStatus
}

const statusColorMap: Record<TaskStatus,string> = {
    [TaskStatus.BACKLOG]: 'border-l-pink-500',
    [TaskStatus.TODO]: 'border-l-gold',
    [TaskStatus.IN_PROGRESS]: 'border-l-purple-500 ',
    [TaskStatus.IN_REVIEW]: 'border-l-blue-500',
    [TaskStatus.DONE]: 'border-l-emerald-500'

}

export const EventCard = ( {id,title,assignee,project,status} : EventCardProps) => {

    const workspaceID = useWorkspaceID()
    const router = useRouter()

    const onClick = ( 
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        event.stopPropagation()
        router.push(`/workspaces/${workspaceID}/tasks/${id}`)
    }

  return (
    <div className='px-2'>
        <div onClick={onClick} className= {cn(' p-1.5 text-xs bg-white text-primary   border-2 border-muted rounded-md flex flex-col gap-1.5 cursor-pointer hover:opacity-75 transition', statusColorMap[status])}>
          <p className=''>  {title}</p>
          <div className='flex items-center gap-x-1'> 
                <MemberAvatar
                name={assignee?.name}
                fallbackClassName='text-xs'
                />
                <div className=' size-1 rounded-full bg-neutral-400'/>
                    <ProjectAvatar
                    name={project?.name}
                    image={project?.imageUrl}
                    />
          </div>
        </div>
    </div>
  )
}
 