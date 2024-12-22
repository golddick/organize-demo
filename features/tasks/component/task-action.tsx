import React from 'react'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { ExternalLinkIcon, PencilIcon, TrashIcon } from 'lucide-react'
import { useDeleteTask } from '../api/use-delete-task'
import { UseConfirm } from '@/hooks/use-confirm'
import { useRouter } from 'next/navigation'
import { useWorkspaceID } from '@/features/workspaces/hooks/use-workspaceID'
import { useUpdateTaskModal } from '../hooks/use-update-task-modal'


  interface TaskActionsProps {
    id: string,
    projectID: string,
    children: React.ReactNode
  }
  

export const TaskActions = ({id,projectID,children}:TaskActionsProps) => {
    const router = useRouter()
    const workspaceID = useWorkspaceID()
    const { open } = useUpdateTaskModal()
    const [ConfirmDialog, confirm] = UseConfirm(
        'Delete task',
        'This action cant be undone',
        'destructive'
    )

    const {mutate: deleteTask, isPending: isDeleting } = useDeleteTask()

    const onDelete = async () => {
        const ok = await confirm();
        if (!ok) return

        deleteTask({param: {taskID: id}})
    }

    const onOpenTask = () => {
        router.push(`/workspaces/${workspaceID}/tasks/${id}`)
    }
    const onOpenProject = () => {
        router.push(`/workspaces/${workspaceID}/projects/${projectID}`)
    }

  return (
    <div className='flex justify-end'>
        <ConfirmDialog/> 
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-48'>
            <DropdownMenuItem 
            onClick={onOpenTask}
            disabled={false}
            className='font-medium'
            >
                <ExternalLinkIcon className=' size-4 stroke-2'/>
                Task Details
            </DropdownMenuItem>

            <DropdownMenuItem 
            onClick={onOpenProject}
            disabled={false}
            className='font-medium'
            >
                <ExternalLinkIcon className=' size-4 stroke-2'/>
                Open Project
            </DropdownMenuItem>


            <DropdownMenuItem 
            onClick={() => open(id)}
            disabled={false}
            className='font-medium'
            >
                <PencilIcon className=' size-4 stroke-2'/>
                Edit Task
            </DropdownMenuItem>


            <DropdownMenuItem 
            onClick={onDelete}
            disabled={isDeleting}
            className='font-medium text-red-700 focus:text-red-700'
            >
                <TrashIcon className=' size-4 stroke-2'/>
                Delete Task
            </DropdownMenuItem>

            </DropdownMenuContent>
        </DropdownMenu>
    </div>
  
  )
}
