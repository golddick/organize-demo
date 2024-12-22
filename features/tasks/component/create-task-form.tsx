'use client'


import { useRef } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

  import { Button } from "@/components/ui/button"
  import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"

  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  
  import { Input } from "@/components/ui/input"
import { DottedSeparator } from '@/components/_component/dotted-separator'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useWorkspaceID } from '@/features/workspaces/hooks/use-workspaceID'
import { createTaskSchema } from '../schemas'
import { useCreateTask } from '../api/use-create-task'
import DateTimePicker from '@/components/_component/Datepicker'
import { MemberAvatar } from '@/features/members/components/member-avatar'
import { TaskStatus } from '../types'
import { ProjectAvatar } from '@/features/projects/component/project-avatar'
import { Textarea } from '@/components/ui/textarea'



interface CreateProjectFormProps {
    onCancel?: () => void
    projectOptions: {id:string, name:string, imageUrl: string}[]
    memberOptions: {id:string,  name:string, }[]
}

export const CreateTaskForm = ({onCancel, projectOptions, memberOptions}:CreateProjectFormProps) => {
    const router = useRouter()
    const { mutate, isPending} = useCreateTask()
    const workspaceID = useWorkspaceID()

  

    const form = useForm<z.infer<typeof createTaskSchema>>({
        resolver: zodResolver(createTaskSchema.omit({workspaceID: true})),
        defaultValues:{
           workspaceID
                }
         })

    const onSubmit = (values:z.infer<typeof createTaskSchema>) => {

        mutate({json: {...values, workspaceID}},{
            onSuccess: ({data}) => {
                form.reset();
                router.push(`/workspaces/${workspaceID}/projects/${values.projectID}`)
                onCancel?.()
            }
        })
    }

  return (
        <Card className=' w-full h-full border-none shadow-none'>
            <CardHeader className=' flex p-7'>
                <CardTitle className=' text-xl font-bold'>Create a new task</CardTitle>
            </CardHeader>
            <div className='px-7'>
                <DottedSeparator color='gold'/>
            </div>
            <CardContent className=' p-7'>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <div className=' flex flex-col gap-y-4'>
                        <FormField
                        control={form.control}
                        name='name'
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Task Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter task Name" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />

                        <FormField
                        control={form.control}
                        name='dueDate'
                        render={({ field }) => (
                            <FormItem className=' flex flex-col '>
                            <FormLabel>Due Date</FormLabel>
                            <FormControl>
                            <DateTimePicker {...field}/>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />


                        <FormField
                        control={form.control}
                        name='assigneeID'
                        render={({ field }) => (
                            <FormItem className=' flex flex-col '>
                            <FormLabel>Assignee</FormLabel>
                            <Select defaultValue={field.value} onValueChange={field.onChange} >
                            <FormControl>
                                <SelectTrigger className=" w-full">
                                    <SelectValue placeholder="Select assignee" />
                                </SelectTrigger>
                            </FormControl>
                            <FormMessage />
                            <SelectContent>
                                   {memberOptions.map((member) => (
                                    <SelectItem key={member.id} value={member.id}>
                                        <div className='flex items-center gap-x-2'>
                                            <MemberAvatar
                                            className='size-6'
                                            name={member.name}
                                            />
                                            {member.name}
                                        </div>
                                    </SelectItem>
                                   ))}
                                </SelectContent>
                            </Select>
                            </FormItem>
                        )}
                        />


                        <FormField
                        control={form.control}
                        name='status'
                        render={({ field }) => (
                            <FormItem className=' flex flex-col '>
                            <FormLabel>Status</FormLabel>
                            <Select defaultValue={field.value} onValueChange={field.onChange} >
                            <FormControl>
                                <SelectTrigger className=" w-full">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                            </FormControl>
                            <FormMessage />
                            <SelectContent>
                                  <SelectItem value={TaskStatus.BACKLOG}>Backlog</SelectItem>
                                  <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
                                  <SelectItem value={TaskStatus.IN_REVIEW}>In Review</SelectItem>
                                  <SelectItem value={TaskStatus.TODO}>Todo</SelectItem>
                                  <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
                            </SelectContent>
                            </Select>
                            </FormItem>
                        )}
                        />

                        <FormField
                        control={form.control}
                        name='projectID'
                        render={({ field }) => (
                            <FormItem className=' flex flex-col '>
                            <FormLabel>Project </FormLabel>
                            <Select defaultValue={field.value} onValueChange={field.onChange} >
                            <FormControl>
                                <SelectTrigger className=" w-full">
                                    <SelectValue placeholder="Select project" />
                                </SelectTrigger>
                            </FormControl>
                            <FormMessage />
                            <SelectContent>
                                   {projectOptions.map((project) => (
                                    <SelectItem key={project.id} value={project.id}>
                                        <div className='flex items-center gap-x-2'>
                                            <ProjectAvatar
                                            className='size-6'
                                            name={project.name}
                                            fallbackClassName=' bg-gold'
                                            image={project.imageUrl}
                                            />
                                            {project.name}
                                        </div>
                                    </SelectItem>
                                   ))}
                                </SelectContent>
                            </Select>
                            </FormItem>
                        )}
                        />


                        <FormField
                        control={form.control}
                        name='description'
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea  placeholder="Enter Description" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                
                        </div>
                        <DottedSeparator color='gold' className='py-7'/>
                        <div className='flex items-center justify-between'>
                         <Button type="button" variant='secondary' size='lg' onClick={onCancel} disabled={isPending } className={cn( !onCancel && ' invisible')}>cancel</Button>
                         <Button type="submit" size='lg' disabled={isPending}>Create Task</Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
  )
}
