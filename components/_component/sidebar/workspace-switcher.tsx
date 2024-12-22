'use client '

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  

import { useGetWorkspaces } from "@/features/workspaces/api/use-get-workspaces"
import { WorkspaceAvatar } from "@/features/workspaces/components/workspace-avatar"
import { useCreateWorkspaceModal } from "@/features/workspaces/hooks/use-create-workspace-modal"
import { useWorkspaceID } from "@/features/workspaces/hooks/use-workspaceID"
import { useRouter } from "next/navigation"
import {RiAddCircleFill} from 'react-icons/ri'

export const WorkspaceSwitcher = () => {
    const workspaceID = useWorkspaceID()
    const router = useRouter()
    const { data: workspaces } = useGetWorkspaces();
    const { open} = useCreateWorkspaceModal()

    const onSelect = (id: string) => {
        router.push(`/workspaces/${id}`)
    }



  return (
    <div className="flex flex-col gap-y-2">
        <div className=" flex items-center justify-between">
            <p className=" text-sm uppercase text-neutral-500">Workspaces</p>
            <RiAddCircleFill className=" size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition" onClick={open}/>
        </div>
        <Select onValueChange={onSelect} value={workspaceID}>
            <SelectTrigger className="w-full bg-neutral-200 font-medium p-2 h-auto border-none  ">
                <SelectValue placeholder="No Workspace Selected"/>
            </SelectTrigger>
            <SelectContent className="border-none w-full">
                {workspaces?.documents.map((workspace) => (
                    <SelectItem key={workspace.$id} value={workspace.$id} className="w-full flex ">
                        <div className="flex justify-start items-center gap-3 font-medium">
                        <WorkspaceAvatar name={workspace.name} image={workspace.ImageUrl}/>
                        <span className=" truncate">{workspace.name}</span>
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    </div>
  )
}
