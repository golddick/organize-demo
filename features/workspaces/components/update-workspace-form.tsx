'use client'


import { useRef } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

  import { Button } from "@/components/ui/button"
  import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
  import { Input } from "@/components/ui/input"
import { DottedSeparator } from '@/components/_component/dotted-separator'
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ArrowLeft, CopyIcon, ImageIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Workspace } from '../types'
import { updateWorkspaceSchema } from '../schemas'
import { useUpdateWorkspace } from '../api/use-update-workspace'
import { UseConfirm } from '@/hooks/use-confirm'
import { useDeleteWorkspace } from '../api/use-delete-workspace'
import { toast } from 'sonner'
import { useResetInviteCode } from '../api/use-reset-invite-code-workspace'


interface UpdateWorkspaceFormProps {
    onCancel?: () => void
    initialValues: Workspace
}

export const UpdateWorkspaceForm = ({onCancel, initialValues}:UpdateWorkspaceFormProps) => {
    const router = useRouter()
    const {mutate:deleteWorkspace, isPending: isDeletingWorkspace} = useDeleteWorkspace()
    const {mutate:resetCode, isPending: isResettingCode} = useResetInviteCode()
    const [DeleteDialog, confirmDelete] = UseConfirm(
        "Delete Workspace",
        "This action can't be undone",
        'destructive'
    )
    const [ResetDialog, confirmReset] = UseConfirm(
        "Reset invite link",
        "This will invalidate the current invite link",
        'destructive'
    )
    const { mutate, isPending} = useUpdateWorkspace()

    const inputRef = useRef<HTMLInputElement>(null)

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
                form.setValue('image', file)
            }
    }

    const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
        resolver: zodResolver(updateWorkspaceSchema),
        defaultValues:{
           ...initialValues,
           image: initialValues.ImageUrl ?? ''
                }
         })

    const onSubmit = (values:z.infer<typeof updateWorkspaceSchema>) => {

        const finalValues = {
            ...values,
            image: values.image instanceof File ? values.image : '',
        }

        mutate({form: finalValues, param: {workspaceID: initialValues.$id}},{
            onSuccess: ({data}) => {
                // router.refresh()
                router.push(`/workspaces/${data.$id}`)
            }
        })
    }

    const handleDelete = async () => {
        const ok = await confirmDelete()

        if (!ok) return;
        deleteWorkspace({
            param:{workspaceID:initialValues.$id}
        },{
            onSuccess:() => {
                window.location.href='/w'
            }
        })
    }
    const handleResetInviteCode = async () => {
        const ok = await confirmReset()

        if (!ok) return;
        resetCode({
            param:{workspaceID:initialValues.$id}
        })
    }

    const fullInviteLink = `${window.location.origin}/workspaces/${initialValues.$id}/join/${initialValues.inviteCode}`
    
    const handleCopyLink = () => {
        navigator.clipboard.writeText(fullInviteLink)
        .then(() => toast.success('Link copied')
        )
    }

  return (
    <div className='flex flex-col gap-y-4'>
        <DeleteDialog/>
        <ResetDialog/>
        <Card className=' w-full h-full border-none shadow-none'>
            <CardHeader className=' flex flex-row items-center gap-x-4 p-7 space-y-0'>
                <Button size='sm' variant='secondary' onClick={onCancel ? onCancel : () => router.push(`/workspaces/${initialValues.$id}`)}> 
                    <ArrowLeft className=' size-4 mr-2'/>
                    Back
                </Button>
                <CardTitle className=' text-xl font-bold'>
                    {initialValues.name} 
                    {' '}
                <i className='text-sm text-gold'>Space Setting</i>
                </CardTitle>
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
                         <Button type="submit" size='lg' disabled={isPending}>Save Changes</Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>

        <Card className='w-full h-full border-none shadow-none '>
            <CardContent className='p-7'>
                <div className='flex flex-col '>
                    <h3 className=' font-bold'>Invite Members</h3>
                    <p className=' text-sm text-muted-foreground '>
                        Use the invite link to add members to your workspace.
                    </p>
                    <div className='mt-4'>
                        <div className='flex items-center gap-x-2'>
                            <Input disabled value={fullInviteLink}/>
                            <Button variant='secondary' onClick={handleCopyLink} className=' size-12'><CopyIcon className=' size-5'/></Button>
                        </div>
                    </div>
                    <DottedSeparator className='py-7' color='gold'/>
                    <Button className='mt-6 w-fit ml-auto' size='sm' variant='default' type='button' disabled={isPending || isResettingCode} onClick={handleResetInviteCode}>Reset Invite Code</Button>
                </div>
            </CardContent>
        </Card>



        <Card className='w-full h-full border-none shadow-none'>
            <CardContent className='p-7'>
                <div className='flex flex-col '>
                    <h3 className=' font-bold'>Danger Zone</h3>
                    <p className=' text-sm text-muted-foreground'>
                        Deleting a workspace is irreversible and will remove all associated data 
                    </p>
                    <DottedSeparator className='py-7' color='gold'/>
                    <Button className='mt-6 w-fit ml-auto' size='sm' variant='destructive' type='button' disabled={isPending || isDeletingWorkspace} onClick={handleDelete}>Delete</Button>
                </div>
            </CardContent>
        </Card>
    </div>
  )
}
