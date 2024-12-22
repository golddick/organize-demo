'use client'


import { useRef } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { createWorkspaceSchema } from '../schemas'
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
import { useCreateWorkspace } from '../api/use-create-workspace'
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ImageIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'


interface CreateWorkspaceFormProps {
    // onCancel?: (onCancel: boolean) => void;
    onCancel?: () => void
}

export const CreateWorkspaceForm = ({onCancel}:CreateWorkspaceFormProps) => {
    const router = useRouter()
    const { mutate, isPending} = useCreateWorkspace()

    const inputRef = useRef<HTMLInputElement>(null)

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
                form.setValue('image', file)
            }
    }

    const form = useForm<z.infer<typeof createWorkspaceSchema>>({
        resolver: zodResolver(createWorkspaceSchema),
        defaultValues:{
            name: "",
                }
         })

    const onSubmit = (values:z.infer<typeof createWorkspaceSchema>) => {

        const finalValues = {
            ...values,
            image: values.image instanceof File ? values.image : '',
        }

        mutate({form: finalValues},{
            onSuccess: ({data}) => {
                form.reset();
                router.push(`/workspaces/${data.$id}`)
            }
        })
    }

  return (
        <Card className=' w-full h-full border-none shadow-none'>
            <CardHeader className=' flex p-7'>
                <CardTitle className=' text-xl font-bold'>Create a new workspace</CardTitle>
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
                            <FormLabel>Workspace Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter Workspace Name" {...field} />
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
                                            <div className=' size-[72px] relative rounded-md overflow-hidden'>
                                                <Image
                                                src={field.value instanceof File
                                                    ? URL.createObjectURL(field.value)
                                                    : field.value}
                                                    alt='Logo'
                                                    fill
                                                    className=' object-cover'
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
                                            <p className='text-sm'>Workspace Logo</p>
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
                         <Button type="submit" size='lg' disabled={isPending}>Create Workspace</Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
  )
}
