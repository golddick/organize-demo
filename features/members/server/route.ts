import { createAdminClient } from "@/lib/appwrite";
import { sessionMiddleWare } from "@/lib/session-middleware";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { GetMember } from "../utils";
import { DATABASE_ID, MEMBERS_ID } from "@/app/config";
import { Query } from "node-appwrite";
import { Member, MemberRole } from "../types";

const app = new Hono()

.get('/members/admin',
sessionMiddleWare, zValidator('query', z.object({workspaceID: z.string() })),
async (c) => {
    const {users} = await createAdminClient();
    const databases = c.get('databases');
    const user = c.get('user');
    const {workspaceID} = c.req.valid('query')

    const members = await databases.listDocuments(
        DATABASE_ID,
        MEMBERS_ID,
        [Query.equal('workspaceID', workspaceID)]
    )

    const populatedMembers = await Promise.all(
        members.documents.map(async (member) => {
            const user = await users.get(member.userID);

            return{
                ...member,
                name: user.name,
                email: user.email,
                role: member.role,
            }
        })
    )

    return c.json ({
        data: {
            ...members,
            documents:populatedMembers
        }
    })
}
)

.get('/',
sessionMiddleWare, zValidator('query', z.object({workspaceID: z.string() })),
async (c) => {
    const {users} = await createAdminClient();
    const databases = c.get('databases');
    const user = c.get('user');
    const {workspaceID} = c.req.valid('query')

    const member = await GetMember({
        databases,
        workspaceID,
        userID: user.$id
    })

    if (!member) {
        return c.json({error: 'Unauthorized'}, 401)
    }

    const members = await databases.listDocuments<Member>(
        DATABASE_ID,
        MEMBERS_ID,
        [Query.equal('workspaceID', workspaceID),
        ]
    )

    const populatedMembers = await Promise.all(
        members.documents.map(async (member) => {
            const user = await users.get(member.userID);
          

            return{
                ...member,
                name: user.name || user.email,
                email: user.email,
                role: member.role,
                
            }
        })
    )

    return c.json ({
        data: {
            ...members,
            documents:populatedMembers
        }
    })
}
)

.delete(
    '/:memberID',sessionMiddleWare,
    async (c) => {
        const {memberID} = c.req.param();
        const user = c.get('user');
        const databases = c.get('databases');

        const memberToDelete = await databases.getDocument(
            DATABASE_ID,
            MEMBERS_ID,
            memberID
        );

        const allMembersInWorkspace = await databases.listDocuments(
            DATABASE_ID,
            MEMBERS_ID,
            [Query.equal('workspaceID', memberToDelete.workspaceID)]
        )

        const selfMember = await GetMember({
            databases,
            workspaceID: memberToDelete.workspaceID,
            userID: user.$id
        })

        if (!selfMember) {
            return c.json({error: 'Unauthorized'}, 401)
        }

        if (selfMember.$id !== memberToDelete.$id && selfMember.role !== MemberRole.ADMIN) {
            return c.json({error: 'Unauthorized'}, 401)
        }

        if (allMembersInWorkspace.total === 1) {
            return c.json({error: 'Cannot delete the only member'}, 400)
        }

        await databases.deleteDocument(
            DATABASE_ID,
            MEMBERS_ID,
            memberID
        )

        return c.json({data: {$id: memberToDelete.$id}})
    }
)


.patch(
    '/:memberID',sessionMiddleWare,zValidator('json', z.object({role: z.nativeEnum(MemberRole)})),
    async (c) => {
        const {memberID} = c.req.param();
        const user = c.get('user');
        const databases = c.get('databases');
        const {role} = c.req.valid('json')

        const memberToUpdate = await databases.getDocument(
            DATABASE_ID,
            MEMBERS_ID,
            memberID
        );

        const allMembersInWorkspace = await databases.listDocuments(
            DATABASE_ID,
            MEMBERS_ID,
            [Query.equal('workspaceID', memberToUpdate.workspaceID)]
        )

        const selfMember = await GetMember({
            databases,
            workspaceID: memberToUpdate.workspaceID,
            userID: user.$id
        })

        if (!selfMember) {
            return c.json({error: 'Unauthorized'}, 401)
        }

        if (selfMember.role !== MemberRole.ADMIN) {
            return c.json({error: 'Unauthorized for updating members role'}, 401)
        }

        if (allMembersInWorkspace.total === 1) {
            return c.json({error: 'Cannot downgrade the only member'}, 400)
        }

        await databases.updateDocument(
            DATABASE_ID,
            MEMBERS_ID,
            memberID,
            {
                role
            }
        )

        return c.json({data: {$id: memberToUpdate.$id}})
    }
)


export default app; 