'use client'

import { ResponsiveModal } from '@/components/_component/responsiveModal/Responsive-modal'
import React from 'react'
import { useUpdateTaskModal } from '../hooks/use-update-task-modal'
import { UpdateTaskFormWrapper } from './update-task-form-wrapper'

export const UpdateTaskModal = () => {
    const { open, setTaskID, close , taskID} = useUpdateTaskModal()
  return (
        <ResponsiveModal open={!!taskID} onOpenChange={close}>
          {taskID && (

            <UpdateTaskFormWrapper onCancel={close} id={taskID}/>
          )}
        </ResponsiveModal>
  )
}
