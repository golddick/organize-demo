import { DATABASE_ID,  PROJECTS_ID, } from "@/app/config"
import { createSessionClient } from "@/lib/appwrite"
import { Project } from "./types"



interface GetProjectProps {
  projectID: string
}

export const getProjectAdmin = async ({projectID}:GetProjectProps) => {
   {
    const {account, databases} = await createSessionClient()
    const user = await account.get()
    // console.log(user)

    const project = await databases.getDocument<Project>(
      DATABASE_ID,
      PROJECTS_ID,
      projectID
   
  );

  return project
  } 
 }




 