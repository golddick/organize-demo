import React from 'react'
import { Task } from '../types'
import { Project } from '@/features/projects/types';
import { ProjectAvatar } from '@/features/projects/component/project-avatar';
import { useWorkspaceID } from '@/features/workspaces/hooks/use-workspaceID';
import Link from 'next/link';
import { ChevronRightIcon, TrashIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDeleteTask } from '../api/use-delete-task';
import { UseConfirm } from '@/hooks/use-confirm';
import { useRouter } from 'next/navigation';

interface TaskBreadcrumbsProps {
    task: Task;
    project: Project
}

export const TaskBreadcrumbs = ({task, project}: TaskBreadcrumbsProps) => {
    const router = useRouter()
    const workspaceID = useWorkspaceID()
    const {mutate , isPending } = useDeleteTask()
    const [ConfirmDialog , confirm] = UseConfirm(
        'Delete Task',
        ' This action cannot be undone ',
        'destructive'
    )

    const handleDeleteTask = async () => {
        const ok = await confirm();
        if (!ok) return;  // Ensure that we only proceed if the user confirms
    
        mutate(
            {
                param: { taskID: task.$id },
            },
            {
                onSuccess: () => {
                    router.push(`/workspaces/${workspaceID}/tasks`);
                },
            }
        );
    };
    
  return (
    <div className='flex items-center gap-x-2'>
        <ConfirmDialog/>
        <ProjectAvatar
        name={project.name}
        image={project.imageUrl}
        className='size-6 lg:size-8'
        />

        <Link href={`/workspaces/${workspaceID}/projects/${project.$id}`}>
            <p className='text-sm lg:text-lg font-semibold text-muted-foreground hover:opacity-75 transition'>{project.name}</p>
        </Link>
        <ChevronRightIcon className=' size-4 lg:size-5 text-muted-foreground'/>
        <p className='text-sm lg:text-lg font-semibold'>{task.name}</p>
        <Button
        className='ml-auto'
        variant={'destructive'}
        size={'sm'}
        disabled={isPending}
        onClick={handleDeleteTask}
        >
            <TrashIcon className='size-4 lg:mr-2'/>
           <span className='hidden lg:block'> Delete Task</span>
        </Button>
    </div>
  )
}
