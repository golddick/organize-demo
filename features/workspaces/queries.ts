import {  Query } from "node-appwrite"
import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from "@/app/config"
import { GetMember } from "../members/utils"
import { Workspace } from "./types"
import { createSessionClient } from "@/lib/appwrite"



export const adminGetWorkspaces = async () => {
   {
    const {account, databases} = await createSessionClient()
    const user = await account.get()
  const workspaces = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACES_ID,
      [
          Query.orderAsc('$createdAt'),
      ]
   
  );

  return workspaces
  } 
 }



 export const getWorkspaces = async () => {
   {
    const {account, databases} = await createSessionClient()
    const user = await account.get()
    // console.log(user)

    const members = await databases.listDocuments(
      DATABASE_ID,
      MEMBERS_ID,
      [
          Query.equal('userID', user.$id)
      ]

      )


  if (members.total === 0) {
      return  { documents: [], total:0 };
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

  return workspaces
  } 
 }


//  interface GetWorkspaceProps {
//     workspaceID: string
//  }

//  export const getWorkspace = async ({workspaceID}:GetWorkspaceProps) => {
//      {
//       const {account, databases} = await createSessionClient()
//       const user = await account.get()
//       // console.log(user)
      
//       const member = await GetMember({
//         databases,
//         userID: user.$id, 
//         workspaceID
//       })

//       if (!member) {
//        throw new Error ("Unauthorized")
//       }
  
//     const workspace = await databases.getDocument<Workspace>(
//         DATABASE_ID,
//         WORKSPACES_ID,
//         workspaceID
     
//     );
  
//     return workspace
//     } 
//    }



