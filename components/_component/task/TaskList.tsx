import { Button } from '@/components/ui/button'
import { useCreateTaskModal } from '@/features/tasks/hooks/use-create-task-modal'
import { Task } from '@/features/tasks/types'
import React from 'react'
import { DottedSeparator } from '../dotted-separator'
import { formatDistanceToNow} from 'date-fns'
import { CalculatorIcon, PlusIcon } from 'lucide-react'
import Link from 'next/link'
import { useWorkspaceID } from '@/features/workspaces/hooks/use-workspaceID'
import { Card, CardContent } from '@/components/ui/card'

interface TaskListProps{
    data: Task[]
    total: number


}


export const TaskList = ({data, total}:TaskListProps) => {
    const workspaceID = useWorkspaceID()
    const { open: createTask} = useCreateTaskModal()
  return (
    <div className='flex flex-col gap-y-4 col-span-1'>
        <div className='bg-white rounded-lg p-4'>
            <div className='flex items-center justify-between'>
                <p className='text-lg font-semibold'>Tasks ({total})</p>
                <Button variant={"secondary"} size={'icon'} onClick={createTask}>
                        <PlusIcon className='size-4 text-neutral-500'/>
                </Button>
            </div>
            <DottedSeparator className='my-4'/>
            <ul className='grid grid-cols-1 md:grid-cols-1 gap-4 '>
                {data.map((task) => (
                    <li key={task.id}>
                        <Link href={`/workspaces/${workspaceID}/tasks${task.$id}`}>
                            <Card className='shadow-none bg-muted border-none rounded-lg hover:opacity-75 transition'>
                                <CardContent className='p-4'>
                                    <p className=' text-lg font-medium truncate capitalize'>{task.name}</p>
                                    <div className='flex items-center gap-x-2 capitalize'>
                                        <p className=' text-sm text-gold'>{task.project?.name}</p>
                                        <div className='size-1 rounded-full bg-neutral-300'/>
                                        <div className='text-sm text-muted-foreground flex items-center'>
                                            <CalculatorIcon className='size-3 mr-1'/>
                                            <span className='truncate'>
                                                {formatDistanceToNow(new Date (task.dueDate))}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    </li>
                ))}
                <li className='text-sm text-muted-foreground text-center hidden first-of-type:block'>
                    No Task Found
                </li>
            </ul>
            <Button variant={'secondary'} asChild className='mt-4 w-full shadow-md shadow-muted'>
                <Link href={`/workspaces/${workspaceID}/tasks`}>
                Show All
                </Link>
            </Button>
        </div>
    </div>
  )
}
