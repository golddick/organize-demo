'use client'

import { DottedSeparator } from "@/components/_component/dotted-separator"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
  

  import { useWorkspaceID } from "@/features/workspaces/hooks/use-workspaceID"
import { ArrowLeft, MoreVerticalIcon } from "lucide-react"
import Link from "next/link"
import { useGetMembers } from "../api/use-get-members"
import { Fragment } from "react"
import { MemberAvatar } from "./member-avatar"
import { useDeleteMember } from "../api/use-delete-member"
import { useUpdateMember } from "../api/use-update-member"
import { MemberRole } from "../types"
import { UseConfirm } from "@/hooks/use-confirm"


export const MembersList = () => {
    const workspaceID = useWorkspaceID();
    const {data} = useGetMembers({workspaceID})

  
    const [ConfirmDialog, confirm] = UseConfirm(
        'Remove member',
        'This member will be removed from the workspace',
        'destructive'
    )
    const {mutate: deleteMember, isPending: isDeletingMember} = useDeleteMember()
    const {mutate: updateMember, isPending: isUpdatingMember} = useUpdateMember()

    const handleUpdateMember = (memberID: string, role: MemberRole) => {
        updateMember({
            json:{role},
            param:{memberID}
        })
    }

    const handleDeleteMember = async (memberID: string) => {
        const ok = await confirm()

        if (!ok) {
            return
        }

        deleteMember({ param: { memberID }}, {
            onSuccess: () => {
                window.location.reload()
            }
        })
    }


  return (
    <Card className="w-full h-full border-none shadow-none">
        <ConfirmDialog/>
        <CardHeader className="flex flex-row items-center gap-x-4 px-7 space-y-0">
            <Button size='sm' variant='secondary' security="s" asChild>
                <Link href={`/workspaces/${workspaceID}`}>
                <ArrowLeft className=" size-4 "/>
                Back
                </Link>
            </Button>
            <CardTitle className=" text-xl font-bold">Members</CardTitle>
        </CardHeader>
        <div className="p-7">
            <DottedSeparator color="gold"/>
        </div>
        <CardContent className=" pb-7 flex-col flex gap-4">
            {data?.documents.map((member, index) => (
                <Fragment key={member.$id}>
                    <div className="flex items-center gap-2">
                        <MemberAvatar name={member.name} fallbackClassName="text-lg" className="size-10 "/>
                       <div className=" flex  items-center gap-6">
                       <div className="flex flex-col">
                            <p className=" text-sm font-medium">{member.name}</p>
                            <p className=" text-xs text-muted-foreground ">{member.email}</p>
                        </div>
                        <p  className=" text-xs text-muted-foreground bg-muted px-4 py-1 rounded-lg ">{member.role}</p>
                       </div>
                       <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button variant='secondary' size='icon' className="ml-auto">
                            <MoreVerticalIcon className="size-4"/>
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="bottom" align="end">
                            {
                                member.role === 'ADMIN' ? (
                                    <DropdownMenuItem className=" font-medium" disabled={isUpdatingMember} onClick={() => handleUpdateMember(member.$id, MemberRole.MEMBER)}>Set as Member</DropdownMenuItem>
                                ): (
                                    <DropdownMenuItem className=" font-medium" disabled={isUpdatingMember} onClick={() => handleUpdateMember(member.$id, MemberRole.ADMIN)}>Set as Administrator</DropdownMenuItem>
                                )
                            }

                            <DropdownMenuItem className=" font-medium text-red-600" disabled={isDeletingMember} onClick={() => handleDeleteMember(member.$id)}>Remove {member.name}</DropdownMenuItem>
                        </DropdownMenuContent>
                       </DropdownMenu>
                    </div>
                    {index < data.documents.length - 1 && (
                        <DottedSeparator className="" />
                    )}
                </Fragment>
            ))}
        </CardContent>
    </Card>
  )
}
