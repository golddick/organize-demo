import { DATABASE_ID, IMAGES_BUCKET_ID, PROJECTS_ID, TASKS_ID } from "@/app/config";
import { GetMember } from "@/features/members/utils";
import { sessionMiddleWare } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { ID, Query } from "node-appwrite";
import { z } from "zod";
import { createProjectSchema, updateProjectSchema } from "../schema";
import { MemberRole } from "@/features/members/types";
import { Project } from "../types";
import {endOfMonth, startOfMonth, subMonths } from 'date-fns'
import { TaskStatus } from "@/features/tasks/types";




const app = new Hono()

.get('/admin/projects',
sessionMiddleWare, zValidator('query', z.object({workspaceID: z.string() })),
async (c) => {
    const databases = c.get('databases');
    const user = c.get('user');
    const {workspaceID} = c.req.valid('query')


    const projects = await databases.listDocuments(
        DATABASE_ID,
        PROJECTS_ID,
        [
            Query.equal('workspaceID', workspaceID),
            Query.orderDesc('$createdAt')
        ]
    )

    return c.json ({ data: projects })
}
)

.get('/',
sessionMiddleWare, zValidator('query', z.object({workspaceID: z.string() })),
async (c) => {
    const databases = c.get('databases');
    const user = c.get('user');
    const {workspaceID} = c.req.valid('query')

    if (!workspaceID) {
        return c.json({error: 'Missing workspaceID'}, 400)
    }

    const member = await GetMember({
        databases,
        workspaceID,
        userID: user.$id
    })

    if (!member) {
        return c.json({error: 'Unauthorized'}, 401)
    }


    const projects = await databases.listDocuments<Project>(
        DATABASE_ID,
        PROJECTS_ID,
        [
            Query.equal('workspaceID', workspaceID),
            Query.orderDesc('$createdAt')
        ]
    )

    return c.json ({ data: projects })
}
)

.post(
    '/',
    zValidator('form', createProjectSchema),
    sessionMiddleWare, async (c) => {

        const databases = c.get('databases');
        const storage = c.get('storage')
        const user = c.get('user');

        const {name, image, workspaceID} = c.req.valid('form')

        const member = await GetMember({
            databases,
            workspaceID,
            userID: user.$id
        })


        if (!member || member.role !== MemberRole.ADMIN) {
            return c.json({ error: 'Unauthorized'}, 401)
        }

        let uploadImageUrl: string | undefined;

        if (image instanceof File) {
            const file = await storage.createFile(
                IMAGES_BUCKET_ID,
                ID.unique(),
                image,
            )

            const arrayBuffer = await storage.getFilePreview(
                IMAGES_BUCKET_ID,
                file.$id,
            )

            uploadImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString('base64')}`
        }

        const project = await databases.createDocument(
            DATABASE_ID,
            PROJECTS_ID,
            ID.unique(),
            {
                name,
                imageUrl:uploadImageUrl,
                workspaceID
            },
        )

      

        return c.json({data: project})
    }
)

.patch(
    "/:projectID", sessionMiddleWare, zValidator('form', updateProjectSchema), async (c) => {
        const databases = c.get('databases');
        const storage = c.get('storage');
        const user = c.get('user')

        const {projectID} = c.req.param()
        const {name, image} = c.req.valid('form')

        const existingProject = await databases.getDocument<Project>(
            DATABASE_ID,
            PROJECTS_ID,
            projectID
        )

        if (!existingProject) {
            throw new Error ('No Existing Project')
        }

        const member = await GetMember({
            databases,
            workspaceID : existingProject.workspaceID,
            userID:user.$id
        })

        if (!member || member.role !== MemberRole.ADMIN) {
            return c.json({ error: 'Unauthorized'}, 401)
        }

        let uploadImageUrl: string | undefined;

        if (image instanceof File) {
            const file = await storage.createFile(
                IMAGES_BUCKET_ID,
                ID.unique(),
                image,
            )

            const arrayBuffer = await storage.getFilePreview(
                IMAGES_BUCKET_ID,
                file.$id,
            )

            uploadImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString('base64')}`
        }else{
            uploadImageUrl = image 
        }

            const project = await databases.updateDocument(
                DATABASE_ID,
                PROJECTS_ID,
                projectID,
                {
                    name,
                    imageUrl: uploadImageUrl
                }
            )

            return c.json({data: project})

    }
)

.delete(
    "/:projectID", sessionMiddleWare, async (c) => {
        const databases = c.get('databases')
        const user = c.get('user')

        const { projectID} = c.req.param()

        const existingProject = await databases.getDocument<Project>(
            DATABASE_ID,
            PROJECTS_ID,
            projectID
        )

        if (!existingProject) {
            throw new Error ('No Existing Project')
        }

        const member = await GetMember({
            databases,
            workspaceID: existingProject.workspaceID,
            userID:user.$id
        });

        if (!member || member.role !== MemberRole.ADMIN) {
            return c.json({ Error: 'Unauthorized to delete'}, 401)
        }

        // todo: delete member, project and task


        await databases.deleteDocument(
            DATABASE_ID,
            PROJECTS_ID,
            projectID
        )

        return c.json({data:{$id: projectID}})
    }
)


.get("/:projectID", sessionMiddleWare, async (c) => {
    const databases = c.get('databases');
    const user = c.get('user');
    const {projectID} = c.req.param()


    const project = await databases.getDocument<Project>(
        DATABASE_ID,
        PROJECTS_ID,
        projectID
    );

      // Verify that the user is a member of the workspace
      const member = await GetMember({
        databases,
        workspaceID: project.workspaceID,
        userID: user.$id
    });

    if (!member ) {
        return c.json({ error: 'Unauthorized' }, 401);
    }

  
   return c.json({data: project})
})





.get("/:projectID/analytics", sessionMiddleWare, async (c) => {
    const databases = c.get('databases');
    const user = c.get('user');
    const { projectID } = c.req.param();

    // Fetch project details
    const project = await databases.getDocument<Project>(
        DATABASE_ID,
        PROJECTS_ID,
        projectID
    );

    // Verify that the user is a member of the workspace
    const member = await GetMember({
        databases,
        workspaceID: project.workspaceID,
        userID: user.$id
    });

    if (!member) {
        return c.json({ error: 'Unauthorized' }, 401);
    }

    // Get the start and end of this month
    const now = new Date();
    const thisMonthStart = startOfMonth(now);
    const thisMonthEnd = endOfMonth(now);

    // Get the start and end of last month
    const lastMonthStart = startOfMonth(subMonths(now, 1)); // Subtract 1 month for last month
    const lastMonthEnd = endOfMonth(subMonths(now, 1));     // End of last month

    // Fetch tasks for this month
    const thisMonthTasks = await databases.listDocuments(
        DATABASE_ID,
        TASKS_ID,
        [
            Query.equal('projectID', projectID),
            Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
            Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString())
        ]
    );

    // Fetch tasks for last month
    const lastMonthTasks = await databases.listDocuments(
        DATABASE_ID,
        TASKS_ID,
        [
            Query.equal('projectID', projectID),
            Query.greaterThanEqual('$createdAt', lastMonthStart.toISOString()),
            Query.lessThanEqual('$createdAt', lastMonthEnd.toISOString())
        ]
    );

    const taskCount = thisMonthTasks.total
    const taskDifference = taskCount - lastMonthTasks.total

      // Fetch assigned tasks
      const thisMonthAssignedTasks = await databases.listDocuments(
        DATABASE_ID,
        TASKS_ID,
        [
            Query.equal('projectID', projectID),
            Query.equal('assigneeID', member.$id),
            Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
            Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString())
        ]
    );
    
    // last month assigned tasks
      const lastMonthAssignedTasks = await databases.listDocuments(
        DATABASE_ID,
        TASKS_ID,
        [
            Query.equal('projectID', projectID),
            Query.equal('assigneeID', member.$id),
            Query.greaterThanEqual('$createdAt', lastMonthStart.toISOString()),
            Query.lessThanEqual('$createdAt', lastMonthEnd.toISOString())
        ]
    );

    const assignedTaskCount = thisMonthAssignedTasks.total
    const assignedTaskDifference = assignedTaskCount - lastMonthAssignedTasks.total

       // Fetch incomplete tasks
       const thisMonthIncompleteTasks = await databases.listDocuments(
        DATABASE_ID,
        TASKS_ID,
        [
            Query.equal('projectID', projectID),
            Query.notEqual('status', TaskStatus.DONE),
            Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
            Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString())
        ]
    );
    
    // last month incomplete tasks
      const lastMonthIncompleteTasks = await databases.listDocuments(
        DATABASE_ID,
        TASKS_ID,
        [
            Query.equal('projectID', projectID),
            Query.notEqual('status', TaskStatus.DONE),
            Query.greaterThanEqual('$createdAt', lastMonthStart.toISOString()),
            Query.lessThanEqual('$createdAt', lastMonthEnd.toISOString())
        ]
    );

    const incompleteTaskCount = thisMonthIncompleteTasks.total;
    const incompleteTaskDifference = incompleteTaskCount - lastMonthIncompleteTasks.total;


           // Fetch completed tasks
           const thisMonthCompletedTasks = await databases.listDocuments(
            DATABASE_ID,
            TASKS_ID,
            [
                Query.equal('projectID', projectID),
                Query.equal('status', TaskStatus.DONE),
                Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
                Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString())
            ]
        );
        
        // last month completed tasks
          const lastMonthCompletedTasks = await databases.listDocuments(
            DATABASE_ID,
            TASKS_ID,
            [
                Query.equal('projectID', projectID),
                Query.equal('status', TaskStatus.DONE),
                Query.greaterThanEqual('$createdAt', lastMonthStart.toISOString()),
                Query.lessThanEqual('$createdAt', lastMonthEnd.toISOString())
            ]
        );

        const completedTaskCount = thisMonthCompletedTasks.total;
        const completedTaskDifference = completedTaskCount - lastMonthCompletedTasks.total;

           // Fetch overdue tasks
           const thisMonthOverdueTasks = await databases.listDocuments(
            DATABASE_ID,
            TASKS_ID,
            [
                Query.equal('projectID', projectID),
                Query.notEqual('status', TaskStatus.DONE),
                Query.lessThan('dueDate', now.toISOString()),
                Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
                Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString())
            ]
        );
        
        // last month overdue tasks
          const lastMonthOverdueTasks = await databases.listDocuments(
            DATABASE_ID,
            TASKS_ID,
            [
                Query.equal('projectID', projectID),
                Query.notEqual('status', TaskStatus.DONE),
                Query.lessThan('dueDate', now.toISOString()),
                Query.greaterThanEqual('$createdAt', lastMonthStart.toISOString()),
                Query.lessThanEqual('$createdAt', lastMonthEnd.toISOString())
            ]
        );

        const overdueTaskCount = thisMonthOverdueTasks.total;
        const overdueTaskDifference = overdueTaskCount - lastMonthOverdueTasks.total;

    return c.json({
       data:{
        taskCount,taskDifference,assignedTaskCount,
        assignedTaskDifference,incompleteTaskCount,
        incompleteTaskDifference,completedTaskCount,
        completedTaskDifference,overdueTaskCount,overdueTaskDifference
       }
    });
});



export default app