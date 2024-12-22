import { DATABASE_ID, MEMBERS_ID } from '@/app/config';
import { Query, type Databases} from 'node-appwrite'

interface GetMemberProps {
    databases: Databases;
    workspaceID: string;
    userID: string
}

export const GetMember = async ({databases,workspaceID,userID}:GetMemberProps) => {

    const members = await databases.listDocuments(
        DATABASE_ID,MEMBERS_ID,
        [
            Query.equal('workspaceID', workspaceID),
            Query.equal('userID', userID)
        ]
    )

    return members.documents[0]
} 