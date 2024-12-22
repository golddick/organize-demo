import { useGetMembers } from '@/features/members/api/use-get-members'
import { useGetProject } from '@/features/projects/api/use-get-projects'
import { useWorkspaceID } from '@/features/workspaces/hooks/use-workspaceID'
import React from 'react'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import DateTimePicker from '@/components/_component/Datepicker'
import { Folder, ListCheck, User2Icon } from 'lucide-react'
import { TaskStatus } from '../types'
import { useTaskFilters } from '../hooks/use-task-filters'
import { DatePicker } from '@/components/_component/datefilter'
  

interface DataFiltersProps {
    hideProjectFilter?: boolean
}

export const DataFilters = ({hideProjectFilter}:DataFiltersProps) => {
    const workspaceID = useWorkspaceID()
    const { data: projects, isLoading: isLoadingProject } = useGetProject({workspaceID})
    const {data: members, isLoading: isLoadingMembers} = useGetMembers({workspaceID})

    const isLoading = isLoadingMembers || isLoadingProject 

    const projectOptions = projects?.documents.map((project) => ({
        value:project.$id,
        label: project.name
    }))

    const memberOptions = members?.documents.map((member) => ({
        value:member.$id,
        label: member.name
    }))

    const [{
        search,status,assigneeID,projectID,dueDate
    }, setFilters ]  = useTaskFilters()

    const onStatusChange = (value: string) => {
        if (value === 'all') {
            setFilters({status: null})
        }else{
            setFilters({status:value as TaskStatus})
        }
    }

    const onAssigneeChange = (value: string) => {
        setFilters({assigneeID: value === 'all' ? null : value as string})
    }
    const onProjectChange = (value: string) => {
        setFilters({projectID: value === 'all' ? null : value as string})
    }
    const onDueDateChange = (value: string) => {
        setFilters({dueDate: value === 'all' ? null : value as string})
    }
    const onSearchChange = (value: string) => {
        setFilters({search: value === 'all' ? null : value as string})
    }


    if (isLoading) {
        return null
    }
  return (
    <div className=' flex flex-col lg:flex-row gap-2'>
        <Select defaultValue={status ?? undefined} onValueChange={(value) => onStatusChange(value)}>
            <SelectTrigger className='w-full lg:w-auto h-8'>
                <div className=' flex items-center pr-2'>
                    <ListCheck className=' size-4 mr-2'/>
                    <SelectValue placeholder='All statuses'/>
                </div>
            </SelectTrigger>
            <SelectContent>
                <SelectItem value='all'>All statuses</SelectItem>
                <SelectSeparator/>
                <SelectItem value={TaskStatus.BACKLOG}>Backlog</SelectItem>
                <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
                <SelectItem value={TaskStatus.IN_REVIEW}>In Review</SelectItem>
                <SelectItem value={TaskStatus.TODO}>Todo</SelectItem>
                <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
            </SelectContent>
        </Select>

        <Select defaultValue={assigneeID ?? undefined} onValueChange={(value) => onAssigneeChange(value)}>
            <SelectTrigger className='w-full lg:w-auto h-8'>
                <div className=' flex items-center pr-2'>
                    <User2Icon className=' size-4 mr-2'/>
                    <SelectValue placeholder='All assignee'/>
                </div>
            </SelectTrigger>
            <SelectContent>
                <SelectItem value='all'>All Assignee</SelectItem>
                <SelectSeparator/>
               {memberOptions?.map((member) => (
                <SelectItem key={member.value} value={member.value}>{member.label}</SelectItem>
               ))}
            </SelectContent>
        </Select>


        {!hideProjectFilter &&(
            
        <Select defaultValue={projectID ?? undefined} onValueChange={(value) => onProjectChange(value)}>
            <SelectTrigger className='w-full lg:w-auto h-8'>
                <div className=' flex items-center pr-2'>
                    <Folder className=' size-4 mr-2'/>
                    <SelectValue placeholder='All projects'/>
                </div>
            </SelectTrigger>
            <SelectContent>
                <SelectItem value='all'>All projects</SelectItem>
                <SelectSeparator/>
               {projectOptions?.map((project) => (
                <SelectItem key={project.value} value={project.value}>{project.label}</SelectItem>
               ))}
            </SelectContent>
        </Select>

            ) }

        <DateTimePicker
        placeholder='Due date'
        value={dueDate ? new Date(dueDate) : undefined}
        className='h-7 w-[250px] lg:w-[250px]'
        onChange={(date) => {
            setFilters({dueDate: date ? date.toISOString() : null})
        }}
        />

        {/* <DatePicker
             placeholder="Due date"
             value={dueDate ? new Date(new Date(dueDate).setHours(0, 0, 0, 0)) : undefined} // Ensure it's a Date object
             className="h-5 w-[300px] lg:w-[300px]"
             onChange={(date) => {
               // Only pass the date (no time) in the ISO format 'YYYY-MM-DD'
               setFilters({ dueDate: date ? date.toISOString().split('T')[0] : null });
             }}
        /> */}
    </div>
  )
}
