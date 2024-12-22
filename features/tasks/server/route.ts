import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { sessionMiddleWare } from "@/lib/session-middleware";
import { DATABASE_ID,  MEMBERS_ID, PROJECTS_ID, TASKS_ID, WORKSPACES_ID } from "@/app/config";
import { ID, Query } from "node-appwrite";
import { MemberRole } from "@/features/members/types";
import { generateInviteCode } from "@/lib/utils";
import { GetMember } from "@/features/members/utils";
import { z } from "zod";
import { createTaskSchema, updateTaskSchema } from "../schemas";
import { Task, TaskStatus } from "../types";
import { createAdminClient } from "@/lib/appwrite";
import { Project } from "@/features/projects/types";

const app = new Hono()

.get("/", sessionMiddleWare, zValidator('query', z.object({
    workspaceID: z.string(),
    projectID: z.string().nullish(),
    assigneeID: z.string().nullish(),
    status: z.nativeEnum(TaskStatus).nullish(),
    search: z.string().nullish(),
    dueDate: z.string().nullish()
})), async (c) => {
    const { users } = await createAdminClient();
    const databases = c.get('databases');
    const user = c.get('user');

    const {
        workspaceID,
        projectID,
        assigneeID,
        status,
        search,
        dueDate
    } = c.req.valid('query');

    // Verify that the user is a member of the workspace
    const member = await GetMember({
        databases,
        workspaceID,
        userID: user.$id
    });

    if (!member) {
        return c.json({ error: 'Unauthorized' }, 401);
    }

    console.log('member', member)

    // Build query dynamically based on input
    const query = [
        Query.equal('workspaceID', workspaceID),
        Query.orderDesc('$createdAt')
    ];

       // If the user is an admin, they can see all tasks, otherwise filter tasks based on assignee
    //    if (member.role !== MemberRole.ADMIN) {
    //     // Non-admins can only see tasks assigned to them
    //     console.log('user is a member')
    //     query.push(Query.equal('assigneeID',member.userID));
    // }

    if (projectID) {
        query.push(Query.equal('projectID', projectID));
    }
    if (status) {
        query.push(Query.equal('status', status));
    }
    if (assigneeID) {
        query.push(Query.equal('assigneeID', assigneeID));
    }
    if (dueDate) {
        query.push(Query.equal('dueDate', dueDate));
    }
    if (search) {
        query.push(Query.equal('search', search));
    }

    // Fetch tasks based on the constructed query
    const tasks = await databases.listDocuments<Task>(
        DATABASE_ID,
        TASKS_ID,
        query
    );

    const projectIDs = tasks.documents.map(task => task.projectID);
    const assigneeIDs = tasks.documents.map(task => task.assigneeID);

    // Fetch related projects if there are any
    const projects = await databases.listDocuments(
        DATABASE_ID,
        PROJECTS_ID,
        projectIDs.length > 0 ? [
            Query.contains('$id', projectIDs) 
        ] : []
    );

    // Fetch related members if there are any
    const members = await databases.listDocuments(
        DATABASE_ID,
        MEMBERS_ID,
        assigneeIDs.length > 0 ? [
            Query.contains('$id', assigneeIDs) 
        ] : []
    );

    const assignees = await Promise.all(
        members.documents.map(async (member) => {
             const user = await users.get(member.userID)

             return{
                ...member,
                name: user.name || user.email,
                email: user.email,
             }
        })
    )

    // Populate tasks with project and assignee information
    const populatedTasks = tasks.documents.map((task) => {
        const project = projects.documents.find((project) => project.$id === task.projectID);
        const assignee = assignees.find((assignee) => assignee.$id === task.assigneeID);

        return {
            ...task,
            project, 
            assignee 
        };
    });

    // Return the populated tasks 
    return c.json({
        data:{
            documents: populatedTasks,
            total:populatedTasks.length
            
        }
    });
})




.post(
    '/',
    zValidator('json', createTaskSchema),
    sessionMiddleWare, async (c) => {

        const databases = c.get('databases');
        const user = c.get('user');

        const {name, status, workspaceID, projectID, assigneeID, dueDate, description,  } = c.req.valid('json')


        const member = await GetMember({
            databases,
            workspaceID,
            userID: user.$id
        })


        if (!member ) {
            return c.json({ error: 'Unauthorized'}, 401)
        }


        const highestPositionTask = await databases.listDocuments(
            DATABASE_ID,
            TASKS_ID,
            [
                Query.orderDesc('position'),
                Query.equal('status', status),
                Query.equal('workspaceID', workspaceID),
                Query.limit(1)

            ]
        )

        const newPosition = highestPositionTask.documents.length > 0 ? highestPositionTask.documents[0].position + 300 : 1000

        const task = await databases.createDocument(
            DATABASE_ID,
            TASKS_ID,
            ID.unique(),
            {
                name,
                status,
                workspaceID,
                projectID,
                assigneeID,
                dueDate,
                description,
                position: newPosition,

            }

        )
        
        return c.json({ data: task })
    }
)


.patch(
    '/:taskID',
    zValidator('json', createTaskSchema.partial()),
    sessionMiddleWare, async (c) => {

        const databases = c.get('databases');
        const user = c.get('user');

        const {name, status, workspaceID, projectID, assigneeID, dueDate, description,  } = c.req.valid('json')
        const {taskID} = c.req.param()

        const existingTask = await databases.getDocument<Task>(
            DATABASE_ID,
            TASKS_ID,
            taskID
        )

        const member = await GetMember({
            databases,
            workspaceID: existingTask.workspaceID,
            userID: user.$id,
        })


        if (!member ) {
            return c.json({ error: 'Unauthorized'}, 401)
        }


        const task = await databases.updateDocument<Task>(
            DATABASE_ID,
            TASKS_ID,
            taskID,
            {
                name,
                status,
                projectID,
                assigneeID,
                dueDate,
                description,
                

            }

        )
        
        return c.json({ data: task })
    }
)



.delete(
    "/:taskID", sessionMiddleWare, async (c) => {
        const databases = c.get('databases')
        const user = c.get('user')

        const { taskID} = c.req.param()

       const task = await databases.getDocument<Task>(
        DATABASE_ID,
        TASKS_ID,
        taskID
       )

       const member = await GetMember({
        databases,
        workspaceID: task.workspaceID,
        userID: user.$id
       })

       if (!member) {
        return c.json({error: 'Unauthorized'})
       }


        await databases.deleteDocument(
            DATABASE_ID,
            TASKS_ID,
            taskID
        )

        return c.json({data:{$id: taskID}})
    }
)


.get("/:taskID", sessionMiddleWare, async (c) => {
    const { users } = await createAdminClient();
    const { taskID} = c.req.param()
    const databases = c.get('databases');
    const currentUser = c.get('user');


    const task = await databases.getDocument<Task>(
        DATABASE_ID,
        TASKS_ID,
        taskID
    );

      // Verify that the user is a member of the workspace
      const currentMember = await GetMember({
        databases,
        workspaceID: task.workspaceID,
        userID: currentUser.$id
    });

    if (!currentMember) {
        return c.json({ error: 'Unauthorized' }, 401);
    }

  
    // Fetch related project if there are any
    const project = await databases.getDocument<Project>(
        DATABASE_ID,
        PROJECTS_ID,
        task.projectID
    );

    // Fetch related member if there are any
    const member = await databases.getDocument(
        DATABASE_ID,
        MEMBERS_ID,
       task.assigneeID
    );

   

    const self = await users.get(member.userID)

        if (!self) {
            console.log('no self user')
            return c.json({ error: 'User not found' }, 404);
        }

    const assignee = {
        ...member,
        name: self.name || self.email,
        email: self.email,
        
    }

 
    // Return the populated tasks 
    return c.json({
        data:{
            ...task,
            project,
            assignee,
        }
    });
})


.post(
    '/bulk-update',
    zValidator('json', z.object({
        tasks: z.array(
            z.object({
                $id: z.string(),
                status: z.nativeEnum(TaskStatus),
                position: z.number().int().positive().min(1000).max(1_000_000)
            })
        )
    })),
    sessionMiddleWare, async (c) => {

        const databases = c.get('databases');
        const user = c.get('user');
        const {tasks  } = c.req.valid('json')

        const tasksToUpdate = await databases.listDocuments<Task>(
            DATABASE_ID,
            TASKS_ID,
            [
                Query.contains('$id', tasks.map((task) => task.$id))
            ]
        )

        const workspaceIDs = new Set(tasksToUpdate.documents.map(task => task.workspaceID))
            if (workspaceIDs.size !== 1) {
                return c.json({ error: 'All Tasks must belong to  the same workspaces' }, 400);
            }
        
        const workspaceID  = workspaceIDs.values().next().value

        // Ensure workspaceID is defined before calling GetMember
            if (!workspaceID) {
                return c.json({ error: 'Workspace ID is missing' }, 400);
            }

        const member = await GetMember({
            databases,
            workspaceID,
            userID: user.$id
        })


        if (!member ) {
            return c.json({ error: 'Unauthorized'}, 401)
        }

        const updatedTasks = await Promise.all( 
            tasks.map(async (task) => {
                const { $id, status, position} = task;
                return databases.updateDocument<Task> (
                    DATABASE_ID,
                    TASKS_ID,
                    $id,
                    {status, position}
                )
            }
        )
        )


     
        
        return c.json({ data: updatedTasks })
    }
)


export default app;