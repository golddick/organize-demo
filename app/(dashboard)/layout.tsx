'use client'

import Navbar from '@/components/_component/navbar/Navbar';
import Sidebar from '@/components/_component/sidebar/Sidebar';
import { CreateProjectModal } from '@/features/projects/component/create-project-modal';
import { CreateTaskModal } from '@/features/tasks/component/create-task-modal';
import { UpdateTaskModal } from '@/features/tasks/component/update-task-modal';
import { CreateWorkspaceModal } from '@/features/workspaces/components/create-workspace-modal';
import React, { Suspense } from 'react'

interface layoutProps {
    children:React.ReactNode;
}

const DashboardLayout = ({children}:layoutProps) => {

  return (
    <div className=' min-h-screen'>
      <CreateWorkspaceModal/>
      <CreateProjectModal/>
      <CreateTaskModal/>
      <UpdateTaskModal/>
      <div className=' flex w-full h-full'>
        <div className=' fixed left-0 top-0 hidden lg:block lg:w-[264px] h-full overflow-y-auto'>
          <Sidebar/>
        </div>
          <div className=' lg:pl-[264px] w-full'>
              <div className=' mx-auto max-w-screen-2xl h-full'>
                <Navbar/>
                <Suspense  >
                  <main className='h-full py-8 px-6 flex flex-col'>

                  {children}
                  </main>
                </Suspense>
              </div>
          </div>
      </div>
    </div>
  )
}

export default DashboardLayout 