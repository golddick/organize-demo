import { Button } from '@/components/ui/button'
import React from 'react'
import { DottedSeparator } from '../dotted-separator'
import {  PlusIcon } from 'lucide-react'
import Link from 'next/link'
import { useWorkspaceID } from '@/features/workspaces/hooks/use-workspaceID'
import { Card, CardContent } from '@/components/ui/card'
import { Project } from '@/features/projects/types'
import { useCreateProjectModal } from '@/features/projects/hooks/use-create-project-modal'
import { ProjectAvatar } from '@/features/projects/component/project-avatar'

interface ProjectListProps{
    data: Project[]
    total: number


}


export const ProjectList = ({data, total}:ProjectListProps) => {
    const workspaceID = useWorkspaceID()
    const {open: createProject } = useCreateProjectModal()

  return (
    <div className='flex flex-col gap-y-4 col-span-1'>
        <div className='bg-white rounded-lg p-4'>
            <div className='flex items-center justify-between'>
                <p className='text-lg font-semibold'>Projects ({total})</p>
                <Button variant={"secondary"} size={'icon'} onClick={createProject}>
                        <PlusIcon className='size-4 text-neutral-500'/>
                </Button>
            </div>
            <DottedSeparator className='my-4'/>
            <ul className='grid grid-cols-1 md:grid-cols-1 gap-4 '>
                {data.map((project) => (
                    <li key={project.id}>
                        <Link href={`/workspaces/${workspaceID}/projects/${project.$id}`}>
                            <Card className='shadow-none bg-muted border-none rounded-lg hover:opacity-75 transition'>
                                <CardContent className='p-4 flex items-center gap-x-2'>
                                   <ProjectAvatar
                                   className='size-10'
                                   fallbackClassName='text-lg'
                                   name={project.name}
                                   image={project.imageUrl}
                                   />
                                   <p className='text-lg font-medium truncate capitalize'>{project.name}</p>
                                </CardContent>
                            </Card>
                        </Link>
                    </li>
                ))}
                <li className='text-sm text-muted-foreground text-center hidden first-of-type:block'>
                    No Project Found
                </li>
            </ul>
        </div>
    </div>
  )
}
