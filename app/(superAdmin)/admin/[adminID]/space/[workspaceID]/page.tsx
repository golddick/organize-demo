
import React from 'react'
import { SpaceMembersList } from './_components/members-list'
import { SpaceProjectList } from './_components/projects-list'


const page = () => {

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
      <SpaceMembersList />
      <SpaceProjectList />
    </div>
  )
}

export default page