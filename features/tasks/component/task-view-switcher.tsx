'use client'

import React, {useCallback} from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button'
import { Loader, PlusIcon } from 'lucide-react'
import { DottedSeparator } from '@/components/_component/dotted-separator'
import { useCreateTaskModal } from '../hooks/use-create-task-modal'
import { useWorkspaceID } from '@/features/workspaces/hooks/use-workspaceID'
import {  useGetTasks } from '../api/use-get-tasks'
import {useQueryState } from 'nuqs'
import { DataFilters } from './data-filters'
import { useTaskFilters } from '../hooks/use-task-filters'
import { DataTable } from './DataTable'
import { columns} from './columns'
import { TaskKanban } from './task-kanban'
import { TaskStatus } from '../types'
import { useUpdateBulkTasks } from '../api/use-update-bulk-tasks'
import { TaskCalender } from './task-calender'
import { useProjectID } from '@/features/projects/hooks/use-projectID'


interface TaskViewSwitcherProps {
    hideProjectFilter?: boolean
}

export const TaskViewSwitcher = ({hideProjectFilter}:TaskViewSwitcherProps) => {
    const [view, setView] = useQueryState('task-view', {
        defaultValue:'table',
    })

    const [{search,status,assigneeID,projectID,dueDate } ]  = useTaskFilters()
    const {mutate: bulkUpdate } = useUpdateBulkTasks()
    const paramProjectID = useProjectID()
    const { isOpen, setIsOpen, close , open} = useCreateTaskModal()
    const workspaceID = useWorkspaceID()
    const {data: tasks, isLoading: isLoadingTasks } = useGetTasks({
        workspaceID,
        search,
        status,
        assigneeID,
        projectID:paramProjectID || projectID,
        dueDate
    })

    const onKanbanChange = useCallback(
        (tasks: { $id: string; status: TaskStatus; position: number }[]) => {
            // Update the tasks state with the new array of tasks
           
            bulkUpdate({
                json: {tasks}
            }) },
        [bulkUpdate] );
    

  return (
    <Tabs defaultValue={view} onValueChange={setView} className="w-full flex-1  rounded-lg">
            <div className=' h-full flex flex-col overflow-auto p-2'>
                    <div className='flex flex-col gap-y-2 lg:flex-row justify-between items-center'>
                    <TabsList className='w-full lg:w-auto'>
                        <TabsTrigger value="table" className='h-8 w-full lg:w-auto'>Table</TabsTrigger>
                        <TabsTrigger value="kanban" className='h-8 w-full lg:w-auto'>Kanban</TabsTrigger>
                        <TabsTrigger value="calender" className='h-8 w-full lg:w-auto'>Calender</TabsTrigger>
                    </TabsList>
                    <Button size='sm' variant='default' className='w-full lg:w-auto' onClick={open}>
                        <PlusIcon className=' size-4 mr-2'/>
                        New
                    </Button>
                    </div>
                    <DottedSeparator className='my-4'/>
                        <DataFilters  hideProjectFilter={hideProjectFilter}/>
                    <DottedSeparator className='my-4'/>
                    {isLoadingTasks ? (
                        <div className='w-full border-gold rounded-lg h-[200px] flex flex-col items-center justify-center'>
                            <Loader className=' animate-spin  size-5 text-muted-foreground'/>
                        </div>
                    ): (
                    <>
                    <TabsContent value="table" className='mt-0'>
                      <DataTable
                      columns={columns}
                      data={tasks?.documents ?? []}
                      />
                    </TabsContent>
                    <TabsContent value="kanban" className='mt-0'>
                        <TaskKanban 
                        data={tasks?.documents ?? []}
                        onChange={onKanbanChange}
                        />
                  
                    </TabsContent>
                    <TabsContent value="calender" className='mt-0'>
                        <TaskCalender 
                        data={tasks?.documents ?? []}
                        />
                    </TabsContent>
                    </>
                     )}
            </div>
    </Tabs>

  )
}
 