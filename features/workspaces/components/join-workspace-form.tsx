'use client'

import { DottedSeparator } from "@/components/_component/dotted-separator"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import Link from "next/link"
import { useJoinWorkspace } from "../api/use-join-workspace"
import { useInviteCode } from "../hooks/use-invite-code"
import { useWorkspaceID } from "../hooks/use-workspaceID"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

  interface JoinWorkspaceFormProps {
    initialValues: {
        name: string
    }
  }
  
  export const JoinWorkspaceForm = ({initialValues}:JoinWorkspaceFormProps) => {
    const router = useRouter()
    const inviteCode = useInviteCode()
    const workspaceID = useWorkspaceID()
    const {mutate, isPending} = useJoinWorkspace()

    const onSubmit = () => {
        mutate({
            param:{workspaceID},
            json: {code: inviteCode}
        },{
            onSuccess:({data})=> {
                router.push(`/workspaces/${data.$id}`)
            }
        })
    }

    return(
        <Card className="w-full h-full border-none shadow-none ">
            <CardHeader className="px-7  justify-center flex items-center">
                <CardTitle className=" text-xl font-bold">Join workspace</CardTitle>
                <CardDescription>
                    You've been invited to join <strong>{initialValues.name}</strong> workspace
                </CardDescription>
            </CardHeader>
            <div className="p-7">
            <DottedSeparator color="gold" />
            </div>
            <CardContent className="px-7">
                <div className=" flex flex-col lg:flex-row gap-4 items-center justify-between ">
                    <Button className="w-full lg:w-fit" disabled={isPending} size='lg' variant='secondary' type="button" asChild>
                        <Link href='/w'>Cancel</Link>
                    </Button>
                    <Button className="w-full lg:w-fit" type='button' size='lg' onClick={onSubmit} disabled={isPending}>Join Workspace</Button>
                </div>
            </CardContent>
        </Card>
    )
  }
