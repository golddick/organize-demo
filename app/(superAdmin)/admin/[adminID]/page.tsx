

import { getCurrent } from '@/features/auth/queries'
import { adminGetWorkspaces } from '@/features/workspaces/queries'
import React from 'react'
import DataTable from './_component/DataTable'







const initialColumns = [
  { field: '$createdAt', headerName: 'Create Date', width: 150 },
  { field: '$id', headerName: 'Workspace ID', width: 200 },
  { field: 'name', headerName: 'Workspace Name', width: 150 },
  { field: 'view', headerName: 'view', width: 100 },

];

interface MappedWorkspace {
  id: string;
  $createdAt: string;
  $id: string;
  name: string;
  view: string;
}

const page =  async () => {

  const user = await getCurrent()
  const workspaces = await adminGetWorkspaces()
  const Admin = user?.labels?.includes('admin');

  


  
  const mappedWorkspaces: MappedWorkspace[] = workspaces.documents.map((workspace) => {
    const link = `/admin/${user?.$id}/space/${workspace.$id}`; // Dynamically construct the link
  
    return {
      id: workspace.$id,  // Assign the unique id for each row
      $createdAt: new Date(workspace.$createdAt).toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
      $id: workspace.$id,
      name: workspace.name,
      // ImageUrl: workspace.ImageUrl,
      view: link,  // Store the dynamically generated link
    };
  });

  console.log("mappedWorkspaces", mappedWorkspaces)
  


  if (!Admin) {
    return null
  }
  return (
    <div>
      <div className=' flex items-center gap-2'>
      <h1> total workspace </h1>

      {workspaces.total}
      </div>

        <DataTable
          columns={initialColumns}
          rows={mappedWorkspaces}
        />
    </div>
  )
}

export default page

