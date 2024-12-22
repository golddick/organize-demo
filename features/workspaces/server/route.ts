import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createWorkspaceSchema, updateWorkspaceSchema } from "../schemas";
import { sessionMiddleWare } from "@/lib/session-middleware";
import { DATABASE_ID, IMAGES_BUCKET_ID, MEMBERS_ID, TASKS_ID, WORKSPACES_ID } from "@/app/config";
import { ID, Query } from "node-appwrite";
import { MemberRole } from "@/features/members/types";
import { generateInviteCode } from "@/lib/utils";
import { GetMember } from "@/features/members/utils";
import { z } from "zod";
import { Workspace } from "../types";
import {endOfMonth, startOfMonth, subMonths } from 'date-fns'
import { TaskStatus } from "@/features/tasks/types";

const app = new Hono()


.get("/", sessionMiddleWare, async (c) => {
    const user = c.get('user')
    const databases = c.get('databases')

    const members = await databases.listDocuments(
        DATABASE_ID,
        MEMBERS_ID,
        [
            Query.equal('userID', user.$id)
        ]

        ) 


    if (members.total === 0) {
        console.log('no member')
        return c.json({data: { documents: [], total:0 }})
    }

    const workspaceIDs = members.documents.map((member) => member.workspaceID)

  
    const workspaces = await databases.listDocuments(
        DATABASE_ID,
        WORKSPACES_ID,
        [
            Query.contains("$id", workspaceIDs),
            Query.orderDesc('$createdAt'),
        ]
     
    );

    return c.json({data: workspaces})
})

.get("/:workspaceID", sessionMiddleWare, async (c) => {
    const databases = c.get('databases');
    const user = c.get('user');
    const {workspaceID} = c.req.param()


  

      // Verify that the user is a member of the workspace
      const member = await GetMember({
        databases,
        workspaceID,
        userID: user.$id
    });

    if (!member ) {
        return c.json({ error: 'Unauthorized' }, 401);
    }

    const workspace = await databases.getDocument<Workspace>(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceID
    );
  
   return c.json({data: workspace})
})

.get("/:workspaceID/info", sessionMiddleWare, async (c) => {
    const databases = c.get('databases');
    const {workspaceID} = c.req.param()



    const workspace = await databases.getDocument<Workspace>(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceID
    );
  
   return c.json({data: 
    {$id:workspace.$id,
     name: workspace.name ,
     image: workspace.imageUrl}})
})

.post(
    '/',
    zValidator('form', createWorkspaceSchema),
    sessionMiddleWare, async (c) => {

        const databases = c.get('databases');
        const storage = c.get('storage')
        const user = c.get('user');

        const {name, image} = c.req.valid('form')

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

        const workspace = await databases.createDocument(
            DATABASE_ID,
            WORKSPACES_ID,
            ID.unique(),
            {
                name,
                userID:user.$id,
                ImageUrl:uploadImageUrl,
                inviteCode:generateInviteCode(10)
            },
        )

        await databases.createDocument(
            DATABASE_ID,
            MEMBERS_ID,
            ID.unique(),
            {
                userID:user.$id,
                workspaceID:workspace.$id,
                role:MemberRole.ADMIN,
            },
        )

        return c.json({data: workspace})
    }
)

.patch(
    "/:workspaceID", sessionMiddleWare, zValidator('form', updateWorkspaceSchema), async (c) => {
        const databases = c.get('databases');
        const storage = c.get('storage');
        const user = c.get('user')

        const {workspaceID} = c.req.param()
        const {name, image} = c.req.valid('form')

        const member = await GetMember({
            databases,
            workspaceID,
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

            const workspace = await databases.updateDocument(
                DATABASE_ID,
                WORKSPACES_ID,
                workspaceID,
                {
                    name,
                    imageUrl: uploadImageUrl
                }
            )

            return c.json({data: workspace})

    }
)

.delete(
    "/:workspaceID", sessionMiddleWare, async (c) => {
        const databases = c.get('databases')
        const user = c.get('user')

        const { workspaceID} = c.req.param()

        const member = await GetMember({
            databases,
            workspaceID, userID:user.$id
        });

        if (!member || member.role !== MemberRole.ADMIN) {
            return c.json({ Error: 'Unauthorized'}, 401)
        }

        // todo: delete member, project and task


        await databases.deleteDocument(
            DATABASE_ID,
            WORKSPACES_ID,
            workspaceID
        )

        return c.json({data:{$id: workspaceID}})
    }
)

.post(
    "/:workspaceID/reset-invite-code", sessionMiddleWare, async (c) => {
        const databases = c.get('databases')
        const user = c.get('user')

        const { workspaceID} = c.req.param()

        const member = await GetMember({
            databases,
            workspaceID, userID:user.$id
        });

        if (!member || member.role !== MemberRole.ADMIN) {
            return c.json({ Error: 'Unauthorized'}, 401)
        }


     const workspace = await databases.updateDocument(
            DATABASE_ID,
            WORKSPACES_ID,
            workspaceID,
            {
                inviteCode:generateInviteCode(10),
            },
        )

        return c.json({data: workspace})
    }
)

.post(
    '/:workspaceID/join', sessionMiddleWare,
    zValidator('json', z.object({code: z.string()})),
    async (c) => {
        const {workspaceID} =c.req.param();
        const {code} = c.req.valid('json');

        const databases = c.get('databases')
        const user = c.get('user')

        const member = await GetMember({
            databases,
            workspaceID, userID:user.$id
        })

        if (member) {
            return c.json({error: 'Already a member'}, 400)
        }

        const workspace = await databases.getDocument<Workspace>(
            DATABASE_ID,
            WORKSPACES_ID,
            workspaceID,
        );

        if (workspace.inviteCode !== code) {
            return c.json ({error: 'Invalid invite code'}, 400)
        }

        await databases.createDocument(
            DATABASE_ID,
            MEMBERS_ID,
            ID.unique(),
            {
                workspaceID,
                userID: user.$id,
                role: MemberRole.MEMBER,

            }
        )

        return c.json({message: 'Joined the workspace successfully', data: workspace})

    }
)



.get("/:workspaceID/analytics", sessionMiddleWare, async (c) => {
    const databases = c.get('databases');
    const user = c.get('user');
    const { workspaceID } = c.req.param();


    // Verify that the user is a member of the workspace
    const member = await GetMember({
        databases,
        workspaceID,
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
            Query.equal('workspaceID', workspaceID),
            Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
            Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString())
        ]
    );

    // Fetch tasks for last month
    const lastMonthTasks = await databases.listDocuments(
        DATABASE_ID,
        TASKS_ID,
        [
            Query.equal('workspaceID', workspaceID),
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
            Query.equal('workspaceID', workspaceID),
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
            Query.equal('workspaceID', workspaceID),
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
            Query.equal('workspaceID', workspaceID),
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
            Query.equal('workspaceID', workspaceID),
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
                Query.equal('workspaceID', workspaceID),
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
                Query.equal('workspaceID', workspaceID),
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
                Query.equal('workspaceID', workspaceID),
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
                Query.equal('workspaceID', workspaceID),
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





export default app;  