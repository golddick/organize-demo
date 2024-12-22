import { Button } from '@/components/ui/button'
import React from 'react'
import { DottedSeparator } from '../dotted-separator'
import {  SettingsIcon } from 'lucide-react'
import Link from 'next/link'
import { useWorkspaceID } from '@/features/workspaces/hooks/use-workspaceID'
import { Card, CardContent } from '@/components/ui/card'
import { Member } from '@/features/members/types'
import { MemberAvatar } from '@/features/members/components/member-avatar'

interface MemberListProps{
    data: Member[]
    total: number


}


export const SpaceMembersList = ({data, total}:MemberListProps) => {
    const workspaceID = useWorkspaceID()

  return (
    <div className='flex flex-col gap-y-4 col-span-1'>
        <div className='bg-white rounded-lg p-4'>
            <div className='flex items-center justify-between'>
                <p className='text-lg font-semibold'>Members ({total})</p>
                <Button variant={"secondary"} size={'icon'}  asChild>
                    <Link href={`/workspaces/${workspaceID}/members`}>
                        <SettingsIcon className='size-4 text-neutral-500'/>
                    </Link>
                </Button>
            </div>
            <DottedSeparator className='my-4'/>
            <ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 '>
                {data.map((member) => (
                    <li key={member.id}>
                            <Card className='shadow-none bg-muted border-none rounded-lg hover:opacity-75 transition overflow-hidden'>
                                <CardContent className='p-3 flex flex-col items-center gap-x-2'>
                                   <MemberAvatar
                                   className='size-10'
                                   fallbackClassName='text-lg'
                                   name={member.name}
                                   />

                                  <div className='flex flex-col items-center overflow-hidden gap-1'>
                                   <p className='text-xs p-1 rounded-md bg-white text-muted-foreground  truncate  line-clamp-1 mt-1'>{member.role}</p>
                                   {/* {member.name && (
                                   <p className='text-lg font-medium truncate capitalize line-clamp-1'>{member.name}</p>
                                   )} */}
                                   <p className='text-xs text-muted-foreground  truncate  line-clamp-1'>{member.email}</p>

                                   </div>

                                </CardContent>
                            </Card>
                    </li>
                ))}
                <li className='text-sm text-muted-foreground text-center hidden first-of-type:block'>
                    No Members Found
                </li>
            </ul>
        </div>
    </div>
  )
}
