'use client'

import { PageError } from "@/components/_component/PageError"
import { PageLoader } from "@/components/_component/PageLoader"
import Analytics from "@/components/_component/analytics/Analytics"
import { SpaceMembersList } from "@/components/_component/member/memberList"
import { ProjectList } from "@/components/_component/project/projectList"
import { TaskList } from "@/components/_component/task/TaskList"
import { useGetMembers } from "@/features/members/api/use-get-members"
import { useGetProject } from "@/features/projects/api/use-get-projects"
import { useGetTasks } from "@/features/tasks/api/use-get-tasks"
import { UseGetWorkspaceAnalytics } from "@/features/workspaces/api/use-get-workspace-analytics"
import { useWorkspaceID } from "@/features/workspaces/hooks/use-workspaceID"

export const WorkspaceIDClient = () => {
    const workspaceID = useWorkspaceID()
    const {data: analytics , isLoading: isLoadingAnalytics } = UseGetWorkspaceAnalytics({workspaceID})
    const {data: tasks , isLoading: isLoadingTasks } = useGetTasks({workspaceID})
    const {data: projects , isLoading: isLoadingProjects } = useGetProject({workspaceID})
    const {data: members , isLoading: isLoadingMembers } = useGetMembers({workspaceID})

  

    const isLoading = isLoadingAnalytics || isLoadingMembers || isLoadingProjects || isLoadingTasks;

    if (isLoading) {
        return <PageLoader/>
    }

    if (!analytics || !tasks || !projects || !members) {
        return <PageError message="Failed to load workspace data"/>
    }
  return (
    <div className="h-full flex flex-col space-y-4">
        <Analytics data={analytics}/>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <TaskList data={tasks.documents} total={tasks.total} />
            <ProjectList data={projects.documents} total={projects.total} />
            <SpaceMembersList data={members.documents} total={members.total} />
        </div>
    </div>
  )
}



