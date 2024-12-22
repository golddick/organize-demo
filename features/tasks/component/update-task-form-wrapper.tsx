
import { Card, CardContent } from '@/components/ui/card';
import { useGetMembers } from '@/features/members/api/use-get-members';
import { useGetProject } from '@/features/projects/api/use-get-projects';
import { useWorkspaceID } from '@/features/workspaces/hooks/use-workspaceID';
import { Loader } from 'lucide-react';
import React from 'react'
import { CreateTaskForm } from './create-task-form';
import { useGetTask } from '../api/use-get-task';
import { UpdateTaskForm } from './update-task-form';

interface UpdateTaskFormWrapperProps {
    onCancel: () => void;
    id:string
}

export const UpdateTaskFormWrapper = ({onCancel, id}:UpdateTaskFormWrapperProps) => {
    const workspaceID = useWorkspaceID()
    const { data: projects, isLoading: isLoadingProjects }  = useGetProject({workspaceID})
    const { data: members, isLoading: isLoadingMembers }  = useGetMembers({workspaceID})
    const { data: initialValues, isLoading: isLoadingTask }  = useGetTask({taskID:id})

    const projectOptions = projects?.documents.map((project) => ({
        id: project.$id,
        name: project.name,
        imageUrl: project.imageUrl
    }))

    const memberOptions = members?.documents.map((member) => ({
        id: member.$id,
        name: member.name,
    }))

    const isLoading = isLoadingMembers || isLoadingProjects || isLoadingTask

    if (!initialValues) {
        return null
    }

    if (isLoading) {
       return(
        <Card className='w-full h-[700px] border-none shadow-none'>
        <CardContent className='flex items-center justify-center h-full'>
            <Loader className='size-5 animate-spin text-muted-foreground'/>
        </CardContent>
        </Card>
       )
    }
 return (
    <div className='h-auto'>
       <UpdateTaskForm initialValues={initialValues} projectOptions={projectOptions ?? []} memberOptions={memberOptions ?? []} onCancel={onCancel}/>
    </div>
 )
}
