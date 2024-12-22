'use client'

import { DottedSeparator } from "@/components/_component/dotted-separator"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Fragment } from "react"
import { MemberAvatar } from "./member-avatar"
import { useGetMembersAdmin } from "@/features/members/api/use-get-members-4Admin"
import { useWorkspaceID } from "@/features/workspaces/hooks/use-workspaceID"
import { useParams } from "next/navigation"





export const SpaceMembersList = () => {
    const params = useParams()
    const adminID = params.adminID
    const workspaceID = useWorkspaceID();
    const {data} = useGetMembersAdmin({workspaceID})



 

  return (
    <Card className="w-full h-full border-none shadow-none">
        <CardHeader className="flex flex-row items-center gap-x-4 px-7 space-y-0">
            <Button size='sm' variant='secondary' security="s" asChild>
                <Link href={`/admin/${adminID}`}>
                <ArrowLeft className=" size-4 "/>
                Back
                </Link>
            </Button>
            <CardTitle className=" text-xl font-bold">{data?.total} {' '} Members</CardTitle>
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
