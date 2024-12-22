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
  import { Input } from "@/components/ui/input"
import { DottedSeparator } from '@/components/_component/dotted-separator'
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ImageIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { createProjectSchema } from '../schema'
import { useCreateProject } from '../api/use-create-project'
import { useWorkspaceID } from '@/features/workspaces/hooks/use-workspaceID'


interface CreateProjectFormProps {
    // onCancel?: (onCancel: boolean) => void;
    onCancel?: () => void
}

export const CreateProjectForm = ({onCancel}:CreateProjectFormProps) => {
    const router = useRouter()
    const { mutate, isPending} = useCreateProject()
    const workspaceID = useWorkspaceID()
    const inputRef = useRef<HTMLInputElement>(null)

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
                form.setValue('image', file)
            }
    }

    const form = useForm<z.infer<typeof createProjectSchema>>({
        resolver: zodResolver(createProjectSchema.omit({workspaceID: true})),
        defaultValues:{
            name: "",
                }
         })

    const onSubmit = (values:z.infer<typeof createProjectSchema>) => {

        const finalValues = {
            ...values,
            workspaceID,
            image: values.image instanceof File ? values.image : '',
        }

        mutate({form: finalValues},{
            onSuccess: ({data}) => {
                form.reset();
                // router.refresh()
                router.push(`/workspaces/${workspaceID}/projects/${data.$id}`)
            }
        })
    }

  return (
        <Card className=' w-full h-full border-none shadow-none'>
            <CardHeader className=' flex p-7'>
                <CardTitle className=' text-xl font-bold'>Create a new Project</CardTitle>
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
                            <FormLabel>Project Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter Project Name" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                        />

                        <FormField
                        control={form.control}
                        name='image'
                        render={({ field }) => (
                            <div className='flex flex-col gap-y-2'>
                                    <div className=' flex items-center gap-x-5'>
                                        {field.value ? (
                                            <div className=' size-[72px] relative rounded-md overflow-hidden '>
                                                <Image
                                                src={field.value instanceof File
                                                    ? URL.createObjectURL(field.value)
                                                    : field.value}
                                                    alt='Logo'
                                                    fill
                                                    className=' object-cover '
                                                />
                                            </div>
                                        ):(
                                            <Avatar className=' size-[72px]'>
                                                <AvatarFallback>
                                                    <ImageIcon className='size-[36px] text-neutral-400'/>
                                                </AvatarFallback>
                                            </Avatar>
                                        )}
                                        <div className='flex flex-col'>
                                            <p className='text-sm'>Project Icon</p>
                                            <p className=' text-sm text-muted-foreground'> JPG, PNG, SVG or JPEG max 1mb</p>
                                            <Input
                                            className='hidden'
                                            type='file'
                                            accept='.jpg, .png, .jpeg, .svg'
                                            ref={inputRef}
                                            disabled={isPending}
                                            onChange={handleImageChange}
                                            />
                                            {field.value ? (
                                              <Button type='button'
                                              disabled={isPending}
                                              variant="destructive"
                                              size='sm'
                                              className='w-fit mt-2'
                                              onClick={() => {
                                                field.onChange(null);
                                                if (inputRef.current) {
                                                    inputRef.current.value = ''
                                                }
                                              }}
                                              >Remove Image</Button>
                                            ):
                                            <Button type='button'
                                            disabled={isPending}
                                            variant="default"
                                            size='sm'
                                            className='w-fit mt-2'
                                            onClick={() => inputRef.current?.click()}
                                            >Select Image</Button>
                                            }
                                          
                                        </div>
                                    </div>
                            </div>
                        )}
                        />
                        </div>
                        <DottedSeparator color='gold' className='py-7'/>
                        <div className='flex items-center justify-between'>
                         <Button type="button" variant='secondary' size='lg' onClick={onCancel} disabled={isPending} className={cn( !onCancel && ' invisible')}>cancel</Button>
                         <Button type="submit" size='lg' disabled={isPending}>Create Project</Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
  )
}
