'use client'

import { DottedSeparator } from "@/components/_component/dotted-separator"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  
import { Fragment } from "react"
import { MemberAvatar } from "./member-avatar"
import { useGetProjectAdmin } from "@/features/projects/api/use-get-projects-admin"
import { useWorkspaceID } from "@/features/workspaces/hooks/use-workspaceID"






export const SpaceProjectList = () => {
    const workspaceID = useWorkspaceID();
    const {data} = useGetProjectAdmin({workspaceID})

  return (
    <Card className="w-full h-full border-none shadow-none">
        <CardHeader className="flex flex-row items-center gap-x-4 px-7 space-y-0">
            <CardTitle className=" text-xl font-bold">{data?.total} {' '} Projects </CardTitle>
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
                        </div>
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
