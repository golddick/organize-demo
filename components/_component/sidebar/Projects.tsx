'use client'

import { useGetProject } from "@/features/projects/api/use-get-projects"
import { ProjectAvatar } from "@/features/projects/component/project-avatar"
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal"
import { useWorkspaceID } from "@/features/workspaces/hooks/use-workspaceID"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { RiAddCircleFill } from "react-icons/ri"

export const Projects = () => {
const workspaceID = useWorkspaceID()
const {data} = useGetProject({workspaceID})
const pathname = usePathname()

if (!workspaceID) {
   console.log('no workspace id')
  }

const {open } = useCreateProjectModal()

// console.log(data)
  return (
    <div className="flex flex-col gap-y-2">
            <div className=" flex items-center justify-between">
            <p className=" text-sm uppercase text-neutral-500">Project</p>
            <RiAddCircleFill className=" size-5 text-neutral-500 cursor-pointer hover:opacity-75 transition" onClick={open}/>
        </div>
        {data?.documents.map((project) => {
            const projectID = project.$id
            const href = `/workspaces/${workspaceID}/projects/${projectID}`
            const isActive = pathname === href 

            return (
                <Link href={href} key={project.$id}>
                    <div className={cn(' flex items-center gap-2 p-2 rounded-md hover:opacity-75 transition cursor-pointer text-neutral-500', 
                    isActive && 'bg-white shadow-sm hover:opacity-100 '
                    )}>
                        <ProjectAvatar name={project.name} image={project.imageUrl}/>
                        <span className=" truncate capitalize">{project.name}</span>
                    </div>
                </Link>
            )
        })}
    </div>
  )
}
